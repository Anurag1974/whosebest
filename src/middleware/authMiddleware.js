import { verifyToken } from '../utils/jwt.js';
import db from "../config/db.js";


const authMiddleware = async (req, res, next) => {
    const token = req.cookies['token'];
    console.log("Token received in middleware:", token);

    if (!token) {
        console.log("No token found, setting req.user to null");
        req.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token);
        console.log("Decoded Token:", decoded);

        if (!decoded) {
            console.log("Invalid token, clearing cookie and setting req.user to null");
            res.clearCookie('token');
            req.user = null;
            return next();
        }

        const [userResult] = await db.query('SELECT user_id, name,email ,profile_image FROM users WHERE email = ?', [decoded.email]);

        if (!userResult.length) {
            console.log("User not found in database, clearing cookie and setting req.user to null");
            res.clearCookie('token');
            req.user = null;
            return next();
        }

        req.user = {
            id: userResult[0].user_id,
            email: userResult[0].email,
            profile_image:userResult[0].profile_image,
            name :userResult[0].name
        };

        console.log("User authenticated:", req.user);
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.clearCookie('token');
        req.user = null;
        next();
    }
};

export default authMiddleware;