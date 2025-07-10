// middleware/auth.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    // Tokeni Authorization header-dən deyil, cookie-dən almaq
    const token = req.cookies.token; // <<-- BURA ÇOX VACİBDİR!

    if (!token) {
        // Əgər cookie-də token yoxdursa
        return res.status(401).json({ message: 'Yetkiləndirmə rədd edildi, token yoxdur.' });
    }

    try {
        // Tokeni doğrulamaq
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // İstifadəçi məlumatlarını `req` obyektinə əlavə etmək
        req.user = decoded; 

        // Növbəti middleware-ə və ya route handler-ə keçmək
        next();
    } catch (error) {
        // Token etibarsızdırsa
        console.error('Token doğrulama xətası:', error.message);
        res.status(401).json({ message: 'Token etibarsızdır.' });
    }
};

export default auth;