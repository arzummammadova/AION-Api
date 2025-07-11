// src/middleware/upload.js
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js'; // Cloudinary config-i import edin
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Bu paketi quraşdırmalısınız!

// `multer-storage-cloudinary` paketi quraşdırılmalıdır:
// npm install multer-storage-cloudinary

// Əgər faylları birbaşa Cloudinary-ə yükləmək istəyirsinizsə (yaddaşa yazmadan):
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Konfiqurasiya olunmuş Cloudinary instance
    params: {
        folder: 'pomodoro-backgrounds', // Cloudinary-də qovluq adı
        format: async (req, file) => 'jpeg', // Fayl formatı
        public_id: (req, file) => `${req.user._id}-${Date.now()}`, // Faylın public ID-si
        // Add other Cloudinary upload parameters here if needed
    },
});

// Yoxsa, faylı yaddaşa yükləyib sonra Cloudinary-ə göndərmək üçün (daha çox Multer nümunələrində istifadə olunur):
// const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB fayl ölçüsü limiti
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Yalnız şəkil fayllarına icazə verilir!'), false);
        }
    }
});

export default upload;