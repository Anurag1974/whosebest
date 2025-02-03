// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory for file uploads
//     },
//     filename: (req, file, cb) => {
//         // Generate a new file name
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const newFileName = `${uniqueSuffix}${path.extname(file.originalname)}`; // Keep the file extension
//         cb(null, newFileName); // Save the file with the new name
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed'), false);
//     }
// };

// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
//     fileFilter
// });

// export default upload;
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { businessId, ownerId } = req.body;

        // Check if it's a business image upload or a user image upload
        if (businessId && ownerId) {
            // For business image upload
            const ownerFolderPath = path.join('uploads', `${ownerId}`); // Example: uploads/18
            const businessFolderPath = path.join(ownerFolderPath, `${businessId}`); // Example: uploads/18/2255

            // Create directories if they don't exist
            fs.mkdirSync(ownerFolderPath, { recursive: true });
            fs.mkdirSync(businessFolderPath, { recursive: true });

            // Provide the final folder path for saving the file
            cb(null, businessFolderPath);
        } else {
            // For user image upload (No businessId and ownerId)
            const userFolderPath = path.join('uploads'); // Example: uploads/users

            // Create directory if it doesn't exist
            fs.mkdirSync(userFolderPath, { recursive: true });

            // Provide the folder path for saving the user image
            cb(null, userFolderPath);
        }
    },
    filename: (req, file, cb) => {
        // Sanitize file name to avoid conflicts
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = `${uniqueSuffix}${fileExtension}`;

        // Save the file with the new unique name
        cb(null, newFileName);
    }
});

// Set up multer to handle image uploads with size and file type restrictions
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

export default upload;

