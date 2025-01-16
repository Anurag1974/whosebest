// middleware.js
export function initializeToggle(req, res, next) {
    if (req.session.toggle === undefined) {
        req.session.toggle = false; // Default value
    }
    next(); // Proceed to the next middleware or route handler
}


