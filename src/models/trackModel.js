// src/models/trackModel.js (düzgündür, dəyişiklik yoxdur)
import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    audioUrl: { // Cloudinary-dən gələn mahnı faylının URL-i
        type: String,
        required: true,
    },
    cloudinaryAudioId: { // Cloudinary-dəki audio faylın ID-si (silmək üçün)
        type: String,
        required: true,
    },
    imageUrl: { // Albom şəklinin URL-i
        type: String,
        required: false,
    },
    cloudinaryImageId: { // Albom şəklini Cloudinary ID-si
        type: String,
        required: false,
    },
}, {
    timestamps: true
});

const Track = mongoose.model('Track', TrackSchema);

export default Track;