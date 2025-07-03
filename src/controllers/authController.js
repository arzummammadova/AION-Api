import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/authModel.js';
import { transporter } from '../utils/mailer.js';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Bütün sahələri doldurun' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'İstifadəçi artıq mövcuddur' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount=await User.countDocuments();
    const role=userCount===0?'admin':'user';

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const emailToken = crypto.randomBytes(32).toString('hex');
    user.emailToken = emailToken;
    user.emailTokenExpires = Date.now() + 1000 * 60 * 60; 
    await user.save();

    const verifyURL = `${process.env.SERVER_URL}/api/auth/verify-email?token=${emailToken}&id=${user._id}`;

    await transporter.sendMail({
        from: `"AION" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'E‑poçtunuzu təsdiqləyin',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <h2 style="color:rgb(232, 208, 77);">Salam, ${user.username}!</h2>
              <p style="font-size: 16px; color: #333;">
                Hesabınızı aktivləşdirmək üçün aşağıdakı düyməyə klik edin:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyURL}" style="background-color:rgb(0, 0, 0); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Hesabı Təsdiqlə
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">
                Bu link 1 saat ərzində etibarlıdır. Əgər siz bu əməliyyatı etməmisinizsə, bu mesajı nəzərə almayın.
              </p>
              <p style="font-size: 14px; color: #999;">Xoş günlər,<br>AION by Arzuui</p>
            </div>
          </div>
        `,
      });
      

    return res.status(201).json({
      message: 'Qeydiyyat uğurludur ✅  E‑poçtunuzu yoxlayın.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token, id } = req.query;

    const user = await User.findById(id);

    if (
      !user ||
      user.emailToken !== token ||
      user.emailTokenExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: 'Link etibarsız və ya vaxtı bitib' });
    }

    user.isVerified = true;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: 'E‑poçt təsdiq olundu ✅. Artıq daxil ola bilərsiniz.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
