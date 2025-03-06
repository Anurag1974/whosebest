import BusinessModel from '../models/busines.model.js';

async function categoryMiddleware(req, res, next) {
    try {
        const businessHeaderCategory = await BusinessModel.getBusinessesByCategory();
        res.locals.businessHeaderCategory = businessHeaderCategory; // Directly passing data as it is
        next();
    } catch (error) {
        console.error("Error in categoryMiddleware:", error);
        res.locals.businessHeaderCategory = [];
        next();
    }
}

export default categoryMiddleware;
