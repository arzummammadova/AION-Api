
import mongoose from 'mongoose';

const TimerSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    selectedDuration: { // Dəqiqə ilə seçilmiş ümumi müddət (misal: 25 dəqiqə)
        type: Number,
        required: true,
    },
    startTime: { // Taymerin ilk başladığı vaxt
        type: Date,
        required: true,
        default: Date.now,
    },
    endTime: { // Taymerin dayandırıldığı və ya tamamlandığı vaxt
        type: Date,
        default: null,
    },
    elapsedTime: { // Taymerin hal-hazırda işlədiyi ümumi saniyə (fasilələr nəzərə alınmadan)
        type: Number,
        default: 0,
    },
    status: { // 'running', 'paused', 'stopped', 'completed'
        type: String,
        enum: ['running', 'paused', 'stopped', 'completed', 'reset'], // 'paused' əlavə edildi
        default: 'running',
    },
    pauseStartTime: { // Taymerin fasiləyə verildiyi vaxt - YENİ
        type: Date,
        default: null,
    },
    totalPausedTime: { // Ümumi fasilə verilmiş vaxt (saniyə ilə) - YENİ
        type: Number,
        default: 0,
    },
    name: {
        type: String,
        default: 'Adsız Taymer', // Əgər ad verilməzsə, bu dəyəri götürsün
        trim: true, // Boşluqları kəssin
    }

    // Əlavə dəyişikliklər üçün gələcəkdə "remainingTime" və ya "lastUpdated" kimi sahələr də əlavə edilə bilər.
}, { timestamps: true });

const TimerSession = mongoose.model('TimerSession', TimerSessionSchema);

export default TimerSession;