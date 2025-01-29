import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for file uploads
    },
    filename: (req, file, cb) => {
        // Generate a new file name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = `${uniqueSuffix}${path.extname(file.originalname)}`; // Keep the file extension
        cb(null, newFileName); // Save the file with the new name
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter
});

export default upload;
