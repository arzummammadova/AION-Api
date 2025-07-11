// C:\Users\hp\Desktop\AION-api\src\controllers\trackController.js
import Track from '../models/trackModel.js'; // Modelinizin doğru yolu
import cloudinary from '../config/cloudinaryConfig.js'; // Cloudinary konfiqurasiya faylının doğru yolu
import fs from 'fs'; // Fayl sistemi modulu

// Bütün mahnıları gətir
export const getAllTracks = async (req, res) => {
    try {
        const tracks = await Track.find({});
        res.status(200).json(tracks);
    } catch (error) {
        console.error("Mahnıları gətirərkən xəta:", error);
        res.status(500).json({ message: 'Mahnıları gətirərkən daxili server xətası.' });
    }
};

// Yeni mahnı əlavə et
export const createTrack = async (req, res) => {
    try {
        // Multer tərəfindən yüklənən fayllar req.files-də olacaq
        // 'audio' və 'image' Multer-in `upload.fields` funksiyasında təyin etdiyimiz adlardır.
        const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;
        const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;

        if (!audioFile) {
            return res.status(400).json({ message: 'Audio faylı tələb olunur.' });
        }

        const { name, artist } = req.body;

        if (!name || !artist) {
            // Yüklənmiş müvəqqəti faylları silin
            if (audioFile && fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);
            if (imageFile && fs.existsSync(imageFile.path)) fs.unlinkSync(imageFile.path);
            return res.status(400).json({ message: 'Mahnının adı və sənətçi adı tələb olunur.' });
        }

        let audioUrl = '';
        let cloudinaryAudioId = '';
        let imageUrl = '';
        let cloudinaryImageId = '';

        // Audio faylını Cloudinary-ə yükləyin
        const audioUploadResult = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video", // Audio üçün "video" istifadə olunur
            folder: "aion_music_tracks", // Cloudinary-də qovluq adı
            format: "mp3" // Lazım gələrsə formatı təyin edin
        });
        audioUrl = audioUploadResult.secure_url;
        cloudinaryAudioId = audioUploadResult.public_id;
        fs.unlinkSync(audioFile.path); // Müvəqqəti audio faylı serverdən silin

        // Əgər şəkil faylı varsa, onu da Cloudinary-ə yükləyin
        if (imageFile) {
            const imageUploadResult = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
                folder: "aion_album_art", // Albom şəkilləri üçün fərqli qovluq
                quality: "auto", // Şəkil keyfiyyətini optimallaşdır
                fetch_format: "auto" // Ən yaxşı formatı seç
            });
            imageUrl = imageUploadResult.secure_url;
            cloudinaryImageId = imageUploadResult.public_id;
            fs.unlinkSync(imageFile.path); // Müvəqqəti şəkil faylı serverdən silin
        }

        // Verilənlər bazasına yeni mahnı yaradın
        const newTrack = new Track({
            name,
            artist,
            audioUrl,
            cloudinaryAudioId,
            imageUrl: imageUrl || undefined, // Boş string olmasın, ya URL ya da undefined
            cloudinaryImageId: cloudinaryImageId || undefined,
        });

        await newTrack.save();

        res.status(201).json({ message: 'Mahnı uğurla əlavə edildi!', track: newTrack });

    } catch (error) {
        console.error("Mahnı əlavə edərkən xəta:", error);
        // Xəta baş verərsə, müvəqqəti yüklənmiş faylları silməyi yoxlayın
        if (req.files && req.files['audio'] && fs.existsSync(req.files['audio'][0].path)) {
            fs.unlinkSync(req.files['audio'][0].path);
        }
        if (req.files && req.files['image'] && fs.existsSync(req.files['image'][0].path)) {
            fs.unlinkSync(req.files['image'][0].path);
        }
        res.status(500).json({ message: 'Mahnı əlavə edərkən daxili server xətası.' });
    }
};

// Mahnını ID-yə görə sil
export const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;

        const track = await Track.findById(id);

        if (!track) {
            return res.status(404).json({ message: 'Mahnı tapılmadı.' });
        }

        // Cloudinary-dən audio faylı sil
        await cloudinary.uploader.destroy(track.cloudinaryAudioId, { resource_type: "video" });

        // Əgər albom şəkli varsa, onu da Cloudinary-dən sil
        if (track.cloudinaryImageId) {
            await cloudinary.uploader.destroy(track.cloudinaryImageId, { resource_type: "image" });
        }

        // Verilənlər bazasından mahnını sil
        await track.deleteOne();

        res.status(200).json({ message: 'Mahnı uğurla silindi.' });

    } catch (error) {
        console.error("Mahnı silərkən xəta:", error);
        res.status(500).json({ message: 'Mahnı silərkən daxili server xətası.' });
    }
};