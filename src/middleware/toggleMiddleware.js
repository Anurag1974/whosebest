export function initializeToggle(req, res, next) {
    if (!req.session.toggle) {
        req.session.toggle = { ev: false, women: false }; // Initialize both toggles separately
    }
    next();
}
