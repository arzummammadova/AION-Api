// models/TimerSession.js

import mongoose from 'mongoose'; 

const TimerSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' sizin istifadəçi schema adınız olmalıdır
        required: true,
    },
    selectedDuration: {
        type: Number, // İstifadəçinin seçdiyi müddət (5, 10, 25 dəqiqə kimi)
        required: true,
        // Bu sahəni əlavə etmək vacibdir ki, istifadəçinin hansı zamanı seçdiyini bilək.
        // `duration` isə actual işləyən vaxt olacaq.
    },
    startTime: {
        type: Date, // Taymerin başladığı vaxt
        required: true,
        default: Date.now // Yeni bir sessiya yaradılanda avtomatik qeyd edilsin
    },
    endTime: {
        type: Date, // Taymerin dayandığı/bitdiyi vaxt (əgər hələ bitməyibsə, null olacaq)
        default: null // Bura `required: true` olmamalıdır, çünki taymer hələ işləyə bilər.
    },
    elapsedTime: {
        type: Number, // Taymerin əslində işlədiyi müddət (saniyə ilə)
        default: 0 // Başlangıcda 0 olacaq
    },
    status: {
        type: String, // Taymerin cari vəziyyəti: 'running', 'stopped', 'completed', 'reset'
        enum: ['running', 'stopped', 'completed', 'reset'], // Yalnız bu dəyərləri qəbul etsin
        required: true,
        default: 'running' // Yeni bir taymer sessiyası başlayanda varsayılan olaraq 'running' olsun
    }
}, {
    timestamps: true // `createdAt` və `updatedAt` sahələrini avtomatik əlavə edir. Bu çox faydalıdır!
});

export default mongoose.model('TimerSession', TimerSessionSchema);