import express from 'express';
import { forgotPassword, login, logout, me, register, verifyEmail } from '../controllers/authController.js';

const router=express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Qeydiyyat və e-poçt təsdiqi
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
 *     summary: E-poçt təsdiqləmə linki
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: E-poçt təsdiq olundu
 *       400:
 *         description: Link etibarsız və ya vaxtı bitib
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
 */




/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Istiifadeci loginin
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
 *       201:
 *         description: Login uğurludur
 */

router.post('/register',register);
router.get('/verify-email',verifyEmail)
router.post('/login',login)
router.get('/me',me)
router.get('/logout',logout)
router.post('/forgot-password',forgotPassword)


export default router;