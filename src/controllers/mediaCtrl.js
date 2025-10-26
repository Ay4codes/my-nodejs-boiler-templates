import mediaServices from "../services/media.services.js"
import response from "../utils/response.js"

class MediaCtrl {

    async getAllMedia(req, res) {
        const getAllMedia = await mediaServices.getAllMedia(req.user, {name: req.query.name, status: req.query.status, dateCreated: req.query.dateCreated, minDateCreated: req.query.minDateCreated, maxDateCreated: req.query.maxDateCreated, start: req.query.start, limit: req.query.limit})
        res.status(getAllMedia.status).json(response(getAllMedia.success, getAllMedia.message, getAllMedia.data, getAllMedia.issue))
    }

    async getAllMediaList(req, res) {
        const getAllMediaList = await mediaServices.getAllMediaList(req.user)
        res.status(getAllMediaList.status).json(response(getAllMediaList.success, getAllMediaList.message, getAllMediaList.data, getAllMediaList.issue))
    }

    async getMedia(req, res) {
        const getMedia = await mediaServices.getMedia(req.user, req.query.id)
        res.status(getMedia.status).json(response(getMedia.success, getMedia.message, getMedia.data, getMedia.issue))
    }

    async deleteMedia(req, res) {
        const deleteMedia = await mediaServices.deleteMedia(req.user, req.query.id)
        res.status(deleteMedia.status).json(response(deleteMedia.success, deleteMedia.message, deleteMedia.data, deleteMedia.issue))
    }

}

export default new MediaCtrl