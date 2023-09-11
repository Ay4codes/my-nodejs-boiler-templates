module.exports = {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"], // Allow resources to be loaded only from the same origin
        "script-src": ["'none'"],  // Disallow inline and external scripts
        "style-src": ["'none'"],   // Disallow inline and external styles
        "img-src": ["'none'"],     // Disallow images
        "connect-src": ["'self'"], // Allow connections only to the same origin
        "font-src": ["'none'"],    // Disallow fonts
        "object-src": ["'none'"],  // Disallow embedded objects
        "media-src": ["'none'"],   // Disallow audio or video
        "frame-src": ["'none'"],   // Disallow frames or iframes
        "child-src": ["'none'"],   // Disallow child sources
        "form-action": ["'none'"], // Disallow form submissions
      },
    },
};