// C:\Users\hp\Desktop\AION-api\src\routers\trackRouter.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAllTracks, createTrack, deleteTrack } from '../controllers/trackController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Ümumi fayl ölçüsü limiti (20MB)
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Yalnız audio və ya şəkil fayllarına icazə verilir!'), false);
        }
    }
});

// GET bütün mahnılar
router.get('/', getAllTracks);

// POST yeni mahnı
router.post('/', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), createTrack); // createTrack funksiyasını çağırırıq

// DELETE mahnı ID-yə görə
router.delete('/:id', deleteTrack);

export default router;