import { CONFIG, DEPLOYMENT_ENV } from "../../config/index.js";
import response from "../utils/response.js";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import Media from '../models/media.model.js';
import ValidationSchema from '../utils/validators.schema.js'
import crypto from 'crypto';
import CustomDate from '../utils/date.js'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const UPLOADS_PATH = DEPLOYMENT_ENV === "development" ? path.join(__dirname, "..", "..", "public", CONFIG.UPLOADS.PATH) : CONFIG.UPLOADS.PATH;

if (!fs.existsSync(UPLOADS_PATH)) fs.mkdirSync(UPLOADS_PATH, { recursive: true });

if (!fs.existsSync(UPLOADS_PATH)) throw new Error(`Upload path does not exist and could not be created: ${UPLOADS_PATH}`);

const DEFAULT_OPTIMIZATION_SETTINGS = {format: 'webp', width: 800, height: 800, fit: 'inside', enlarge: 'false'};

class MediaServices {

    constructor() {
        
        this.storage = multer.diskStorage({
        
            destination: (req, file, cb) => {
        
                cb(null, UPLOADS_PATH);
        
            },
        
            filename: (req, file, cb) => {
        
                const uniquePrefix = crypto.randomBytes(16).toString('hex');

                const finalName = uniquePrefix + path.extname(file.originalname); 
        
                cb(null, finalName);
        
            },
        
        });
        
        this.upload = multer({
        
            storage: this.storage,
        
        });   
        
        this.supportedFormats = {
        
            '.gif': {extension: ".gif", sharpMethod: "gif", options: {quality: 100}},
            
            '.jpeg': {extension: ".jpg", sharpMethod: "jpeg", options: {quality: 90, progressive: true}},
            
            '.jpg': {extension: ".jpg", sharpMethod: "jpeg", options: {quality: 90, progressive: true}},
            
            '.png': {extension: ".png", sharpMethod: "png", options: {quality: 90, compressionLevel: 6}},
            
            '.webp': {extension: ".webp", sharpMethod: "webp", options: {quality: 90}},
            
            '.avif': {extension: ".avif", sharpMethod: "avif", options: {quality: 90}},
        
        };
    
    }   
    
    
    getOutputFormat(originalFilename) {

        const originalExtension = path.extname(originalFilename).toLowerCase();  
        
        if (!originalExtension || !this.supportedFormats[originalExtension]) return this.supportedFormats['.jpg'];

        return this.supportedFormats[originalExtension];

    }   


    getResizeDimensions(settings) {
        
        const width = parseInt(settings.width) || 800;

        const height = parseInt(settings.height) || 800;

        const fit = settings.fit || "inside";

        const withoutEnlargement = settings.enlarge !== "true";  

        return {width: Math.min(Math.max(width, 50), 2000), height: Math.min(Math.max(height, 50), 2000), fit: fit, withoutEnlargement};
    
    }   
    
    
    async isAnimatedGif(filePath) {
        
        try {
        
            const metadata = await sharp(filePath).metadata();
        
            return metadata.format === "gif" && metadata.pages > 1;
        
        } catch (err) {
        
            return false;
        }
    
    }
    
    
    async processAnimatedGif(inputPath, outputPath, resizeDimensions, outputFormat) {
        
        try {
            
            let sharpInstance = sharp(inputPath, {animated: true, failOnError: true}); 
            
            sharpInstance = sharpInstance.resize({
            
                width: resizeDimensions.width,
            
                height: resizeDimensions.height,
            
                fit: resizeDimensions.fit,
            
                withoutEnlargement: resizeDimensions.withoutEnlargement,
            
            }); 
            
            sharpInstance = sharpInstance[outputFormat.sharpMethod](outputFormat.options);  
            
            await sharpInstance.toFile(outputPath);
            
            return true;
        
        } catch (err) {
        
            return false;
        
        }
    
    }   
    
    async optimizeAnimatedGifFallback(inputPath, outputPath, outputFormat) {
        
        try {
        
            if (outputFormat.sharpMethod === "gif") {
        
                await sharp(inputPath, { animated: true }).gif(outputFormat.options).toFile(outputPath);
                
                return true;
            
            } else {
                
                let sharpInstance = sharp(inputPath).resize({width: 800, height: 800, fit: "inside", withoutEnlargement: true});   
                
                sharpInstance = sharpInstance[outputFormat.sharpMethod](outputFormat.options);
                
                await sharpInstance.toFile(outputPath);
                
                return true;
            
            }
        
        } catch (err) {
        
            return false;
        
        }
    
    }   

    async acceptMedia(req, file, body) {
        
        const { error, value: data } = ValidationSchema.uploadMedia.validate(body);
        
        if (error) return {success: false, status: 400, message: error.message};
        
        const optimizationSettings = { ...DEFAULT_OPTIMIZATION_SETTINGS};
        
        const originalFilename = file.filename;
        
        const originalPath = path.join(UPLOADS_PATH, originalFilename);
        
        const outputFormat = this.getOutputFormat(file.originalname);
        
        const resizeDimensions = this.getResizeDimensions(optimizationSettings);   
        
        const media = new Media({

            name: data.name,

            user: req?.user?._id,

            description: data.description,

            contentType: file.mimetype,

            fileType: outputFormat.extension.substring(1).toUpperCase(),

            downloadAccess: data.downloadAccess,

            createdBy: req?.user?._id,

            directory: '', 

            fileSize: 0,

        });
        
        const finalFilename = `${media._id.toHexString()}${outputFormat.extension}`;

        const finalOptimizedPath = path.join(UPLOADS_PATH, finalFilename);
        
        try {

            let processed = false;

            const isAnimated = await this.isAnimatedGif(originalPath);  
        
            if (isAnimated) {
        
                processed = await this.processAnimatedGif(originalPath, finalOptimizedPath, resizeDimensions, outputFormat);    
        
                if (!processed) processed = await this.optimizeAnimatedGifFallback(originalPath, finalOptimizedPath, outputFormat);
        
                if (!processed) {

                    fs.copyFileSync(originalPath, finalOptimizedPath);

                    processed = true;

                }
        
            } else {
        
                let sharpInstance = sharp(originalPath, { failOnError: true }).resize(resizeDimensions);    
        
                sharpInstance = sharpInstance[outputFormat.sharpMethod](outputFormat.options);    
        
                await sharpInstance.toFile(finalOptimizedPath);
        
                processed = true;
        
            }   
            
            if (processed) {
                
                const fileStats = fs.statSync(finalOptimizedPath);

                media.directory = finalFilename; 

                media.fileSize = fileStats.size;

                const savedMedia = await media.save();

                setTimeout(() => {

                    fs.promises.unlink(originalPath).catch((err) => console.error("Failed to delete original file:", err));

                }, 500);

                return {success: true, status: 201, message: "Media processed and saved successfully", data: savedMedia};
            
            } else {
                
                if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
                
                if (fs.existsSync(finalOptimizedPath)) fs.unlinkSync(finalOptimizedPath); 
                
                throw new Error("Failed to process file");
            
            }

        } catch (err) {
            
            if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
            
            if (fs.existsSync(finalOptimizedPath)) fs.unlinkSync(finalOptimizedPath); 
            
            return { success: false, status: 500, message: "Media processing failed: " + err.message };

        }

    }

    
    async uploadMedia(req, res) {

        const { error, value: data } = ValidationSchema.uploadMedia.validate(req.body);
        
        if (error) return res.status(400).json(response(false, error.details[0].message))
        
        if (!req.file) return res.status(400).json(response(false, "No File uploaded")); 

        const mediaExist = await Media.findOne({name: data?.name?.toUpperCase()})

        if (mediaExist) return res.status(400).json(response(false, "File already exist"));
        
        const result = await this.acceptMedia(req, req.file, data);

        if (result.success) return res.status(201).json(response(true, "File uploaded successfully", result.data));

        return res.status(result.status).json(response(false, result.message));

    }  
    
    
    async uploadMultipleMedia(req, res) {

        const { error, value: data } = ValidationSchema.uploadMedia.validate(req.body);
        
        if (error) return res.status(400).json(response(false, error.details[0].message))
        
        if (!req.files || req.files.length === 0) return res.status(400).json(response(false, "No files uploaded"));

        const mediaExist = await Media.findOne({name: data?.name?.toUpperCase()})

        if (mediaExist) return res.status(400).json(response(false, "File already exist"));

        const uploadedMediaRecords = [];
    
        const failedUploads = [];

        for (const file of req.files) {

            const result = await this.acceptMedia(req, file, data); 

            if (result.success) {
            
                uploadedMediaRecords.push({mediaId: result.data?._id, filename: result.data?.name});
            
            } else {
            
                failedUploads.push({originalname: file.originalname, reason: result.message});
            
            }
        
        }

        if (uploadedMediaRecords.length > 0) {
            
            let message = `Successfully uploaded ${uploadedMediaRecords.length} of ${req.files.length} files.`;
            
            if (failedUploads.length > 0) message += ` (${failedUploads.length} failed)`;

            return res.status(201).json(response(true, message, {uploaded: uploadedMediaRecords, failed: failedUploads}));

        } else {
           
            return res.status(500).json(response(false, "All file uploads failed.", {failed: failedUploads}));
        }

    } 


    async getAllMedia(user, queryParams) {

        const {error, value: data} = ValidationSchema.getAllMedia.validate(queryParams)
        
        if (error) return {success: false, status: 400, message: error.message}

        const query = {}
    
        if (data.name) query.name = data.name

        if (data.status) query.status = data.status

        if (data.dateCreated) query.createdAt = {
                    
            $gte: CustomDate.getStartOfDay(data.dateCreated),
            
            $lt: CustomDate.getStartOfNextDay(data.dateCreated)
        }

        if (data.minDateCreated || data.maxDateCreated) {

            query.createdAt = query.createdAt || {}
    
            if (data.minDateCreated) query.createdAt.$gte = CustomDate.getStartOfDay(data.minDateCreated);
    
            if (data.maxDateCreated) query.createdAt.$lt = CustomDate.getStartOfNextDay(data.maxDateCreated);
        
        }
    
        const getMedia = await Media.find(query).populate({path: 'user', select: 'firstName lastName email'}).sort({createdAt: -1}).skip(data.start).limit(data.limit)
    
        return {success: true, status: 200, message: 'Media retrieved successfully', data: getMedia}
    
    }

    
    async getAllMediaList(user) {
    
        const getMedia = await Media.find({}).sort({createdAt: -1}).lean()
    
        return {success: true, status: 200, message: 'Media retrieved successfully', data: getMedia}
    
    }


    async getMedia(user, id) {
    
        const {error, value: data} = ValidationSchema.getById.validate({id})
        
        if (error) return {success: false, status: 400, message: error.message}
    
        const mediaExist = await Media.findOne({_id: data.id})
    
        if (!mediaExist) return {success: false, status: 404, message: 'Media not found'}
    
        return {success: true, status: 200, message: 'Media retrieved successfully', data: mediaExist}
    
    }


    async updateMedia(user, body) {

        const {error, value: data} = ValidationSchema.updateMedia.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const mediaRecord = await Media.findOneAndUpdate({_id: data.id}, {$set: {name: data.name}}, {new: true});

        if (!mediaRecord) return {success: false, status: 404, message: "Media not found"};

        return {success: true, status: 200, message: "Media updated successfully."};
    
    }

    
    async deleteMedia(user, id) {

        const {error, value: data} = ValidationSchema.deleteById.validate({id: id})

        if (error) return {success: false, status: 400, message: error.message}

        const mediaRecord = await Media.findOneAndUpdate({_id: data.id}, {$set: {status: 'DELETED'}}, {new: true});

        if (!mediaRecord) return {success: false, status: 404, message: "Media record not found or already marked as deleted."};

        return {success: true, status: 200, message: "Media DELETED successfully."};
    
    }

}

export default new MediaServices