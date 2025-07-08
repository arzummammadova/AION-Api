import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  me,
  otpVerify,
  register,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Qeydiyyat, daxilolma və təsdiqləmə əməliyyatları
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni istifadəçi qeydiyyatı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Qeydiyyat uğurludur
 *       400:
 *         description: İstifadəçi artıq mövcuddur
 */

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: E-poçt təsdiqləmə
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E-poçt təsdiq olundu
 *       400:
 *         description: Link etibarsız və ya vaxtı bitib
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: İstifadəçi daxil olur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Daxilolma uğurludur
 *       401:
 *         description: Email və ya şifrə yanlışdır
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Aktiv istifadəçi məlumatları
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: İstifadəçi məlumatları uğurla gətirildi
 *       401:
 *         description: Giriş edilməyib
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: İstifadəçinin çıxışı
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Uğurla çıxış edildi
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Şifrəni yeniləmək üçün OTP göndər
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP göndərildi
 *       404:
 *         description: İstifadəçi tapılmadı
 */

/**
 * @swagger
 * /auth/otp-verify:
 *   post:
 *     summary: OTP kodunu təsdiqlə
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP təsdiqləndi
 *       400:
 *         description: OTP etibarsızdır
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Yeni şifrə təyin et
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifrə yeniləndi
 *       400:
 *         description: Təsdiqləmə tələb olunur
 */

// Yönləndirmələr
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/me', me);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/otp-verify', otpVerify);
router.post('/reset-password', resetPassword);

export default router;
