// import fs from 'fs';
// import path from 'path';
// import multer from 'multer';

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const { businessId, ownerId,userId ,driverUserId} = req.body;
//         console.log("Received:", { businessId, ownerId });

//         if (businessId && ownerId) {
//             // Define paths
//             const ownerFolderPath = path.join('uploads', `${ownerId}`);
//             const businessFolderPath = path.join(ownerFolderPath, `${businessId}`);
//             const thumbnailFolderPath = path.join(businessFolderPath, 'thumbnail');

//             // Check if folders exist, create if not
//             if (!fs.existsSync(ownerFolderPath)) {
//                 fs.mkdirSync(ownerFolderPath, { recursive: true });
//             }
//             if (!fs.existsSync(businessFolderPath)) {
//                 fs.mkdirSync(businessFolderPath, { recursive: true });
//             }
//             if (!fs.existsSync(thumbnailFolderPath)) {
//                 fs.mkdirSync(thumbnailFolderPath, { recursive: true });
//             }

//             // Store thumbnails separately
//             if (file.fieldname === 'thumbnail') {
//                 cb(null, thumbnailFolderPath);
//             } else {
//                 cb(null, businessFolderPath);
//             }
//         } else if (userId) { // Check for profile images
//             const ownerFolderPath = path.join('uploads', `${userId}`);
//             const profileFolderPath = path.join(ownerFolderPath, 'profile');

//             // Check and create profile folders
//             if (!fs.existsSync(ownerFolderPath)) {
//                 fs.mkdirSync(ownerFolderPath, { recursive: true });
//             }
//             if (!fs.existsSync(profileFolderPath)) {
//                 fs.mkdirSync(profileFolderPath, { recursive: true });
//             }

//             cb(null, profileFolderPath);
//         } else {
//             cb(new Error("ownerId is required for profile images"), null);
//         }
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const newFileName = `${uniqueSuffix}${fileExtension}`;

//         cb(null, newFileName);
//     }
// });

// // Set up multer with size and file type restrictions
// const upload = multer({
//     storage,
//     limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max file size
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed'), false);
//         }
//     }
// });

// export default { upload };


import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { businessId, ownerId, userId, driverUserId } = req.body;
        console.log("Received:", { businessId, ownerId, userId, driverUserId });

        if (businessId && ownerId) {
            // Define paths
            const ownerFolderPath = path.join('uploads', `${ownerId}`);
            const businessFolderPath = path.join(ownerFolderPath, `${businessId}`);
            const thumbnailFolderPath = path.join(businessFolderPath, 'thumbnail');

            // Check if folders exist, create if not
            if (!fs.existsSync(ownerFolderPath)) {
                fs.mkdirSync(ownerFolderPath, { recursive: true });
            }
            if (!fs.existsSync(businessFolderPath)) {
                fs.mkdirSync(businessFolderPath, { recursive: true });
            }
            if (!fs.existsSync(thumbnailFolderPath)) {
                fs.mkdirSync(thumbnailFolderPath, { recursive: true });
            }

            // Store thumbnails separately
            if (file.fieldname === 'thumbnail') {
                cb(null, thumbnailFolderPath);
            } else {
                cb(null, businessFolderPath);
            }
        } else if (userId) { 
            // Handling Profile Images
            const userFolderPath = path.join('uploads', `${userId}`);
            const profileFolderPath = path.join(userFolderPath, 'profile');

            // Check and create profile folder
            if (!fs.existsSync(userFolderPath)) {
                fs.mkdirSync(userFolderPath, { recursive: true });
            }
            if (!fs.existsSync(profileFolderPath)) {
                fs.mkdirSync(profileFolderPath, { recursive: true });
            }

            cb(null, profileFolderPath);
        } else if (driverUserId) { 
            // Handling Driver Images
            const driverFolderPath = path.join('uploads', `${driverUserId}`);
            const driverImagesFolder = path.join(driverFolderPath, 'driver');

            // Check if driverUserId folder exists, create if not
            if (!fs.existsSync(driverFolderPath)) {
                fs.mkdirSync(driverFolderPath, { recursive: true });
            }
            if (!fs.existsSync(driverImagesFolder)) {
                fs.mkdirSync(driverImagesFolder, { recursive: true });
            }

            cb(null, driverImagesFolder);
        } else {
            cb(new Error("ownerId, userId, or driverUserId is required"), null);
        }
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = `${uniqueSuffix}${fileExtension}`;

        cb(null, newFileName);
    }
});

// Set up multer with size and file type restrictions
const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max file size
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

export default { upload };
