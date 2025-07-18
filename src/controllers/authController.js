import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/authModel.js";
import { transporter } from "../utils/mailer.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
} from "../validations/userValidation.js";
import jwt from "jsonwebtoken";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Bütün sahələri doldurun" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "İstifadəçi artıq mövcuddur" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const emailToken = crypto.randomBytes(32).toString("hex");
    user.emailToken = emailToken;
    user.emailTokenExpires = Date.now() + 1000 * 60 * 60;
    await user.save();

    const verifyURL = `${process.env.SERVER_URL}/api/auth/verify-email?token=${emailToken}&id=${user._id}`;

    await transporter.sendMail({
      from: `"AION" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "E‑poçtunuzu təsdiqləyin",
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
      message: "Qeydiyyat uğurludur ✅  E‑poçtunuzu yoxlayın.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
        .json({ message: "Link etibarsız və ya vaxtı bitib" });
    }

    user.isVerified = true;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;
    await user.save();

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/email-verified-success`
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email və ya parol yanlış" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Email və ya parol yanlış" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Testiq edilmeyib" });
    }
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'none',
    //   maxAge: 60 * 60 * 1000,
    // });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV === 'production', // remove or set to false for local HTTP
    //   sameSite: "lax", // or 'none' if testing
    //   maxAge: 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
    httpOnly: true,
   
    secure: process.env.NODE_ENV === 'production', 
   
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 60 * 60 * 1000, // 1 saat
   
});
    return res.status(200).json({
      message: "Giriş uğurludur ✅",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log('Backend: Received token from cookie:', token);

    if (!token) {
      // console.log('Backend: No token found in cookies');
      return res.status(401).json({ message: "Token yoxdur" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use jwt.verify
      // console.log('Backend: Decoded token:', decoded);
    } catch (err) {
      // console.log('Backend: Token verification failed:', err.message);
      return res.status(401).json({ message: "Token etibarsızdır" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      // console.log('Backend: User not found after decoding token');
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.json(user);
  } catch (err) {
    // console.log('Backend: Server error in me function:', err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 0,
//     });
//     return res.status(200).json({ message: "Çıxış uğurludur ✅" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };


export const logout = async (req, res) => {
  try {
    // These options MUST EXACTLY MATCH those used when the cookie was set during login
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Match login's 'secure'
      // For sameSite: 'none', it's crucial to also have 'secure: true'.
      // If secure is false (e.g., in development), then sameSite must not be 'none'.
      // It's generally safest to apply the same conditional logic.
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Match login's 'sameSite'
      // You might also need to explicitly set 'path' and 'domain' if they were used when setting the cookie.
      // If not specified during setting, they default to the path of the request that set it and the current domain.
      // path: '/', // Often a good default if your cookie is site-wide
      // domain: 'aion-api.onrender.com' // Only if you explicitly set a domain when creating the cookie
    };

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({ message: "Çıxış uğurludur ✅" });
  } catch (error) {
    console.error("Logout error:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Server xətası", error: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email sahəsini boş buraxa bilməzsiniz." });
    }

    // 1. İstifadəçini emailə görə tap
    const user = await User.findOne({ email });
    if (!user) {
      // Təhlükəsizlik səbəbiylə, istifadəçi tapılmasa da
      // kodun göndərildiyi barədə məlumat vermək daha yaxşıdır.
      return res.status(200).json({
        message: "Əgər email sistemdə mövcuddursa, şifrə sıfırlama kodu göndərildi.",
      });
    }

    // OTP yarat və vaxtını təyin et
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 rəqəmli OTP
    const otpExpires = Date.now() + 1000 * 60 * 10; // 10 dəqiqə

    // OTP və vaxtını istifadəçinin modelinə yaz
    user.otp = otp;
    user.otpExpires = new Date(otpExpires); // Date obyekti olaraq qeyd et
    await user.save(); // Dəyişiklikləri bazaya yaz!

    // Verify səhifəsinin URL-i
    const verifyPageURL = `${process.env.CLIENT_URL}/auth/otp-verify?email=${encodeURIComponent(email)}`;

    // Email göndərmək üçün mailOptions
    const mailOptions = {
      from: `"AION" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Şifrə Sıfırlama Kodu",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color:rgb(255, 219, 12);">Salam, ${user.username}!</h2>
            <p style="font-size: 16px; color: #333;">
              Şifrənizi sıfırlamaq üçün OTP kodunuz:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <p style="background-color:rgb(0, 0, 0); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 24px;">
                ${otp}
              </p>
            </div>
            <p style="font-size: 14px; color: #666;">
              Bu kod 10 dəqiqə ərzində etibarlıdır. Əgər siz bu əməliyyatı etməmisinizsə, bu mesajı nəzərə almayın.
            </p>
            <a href="${verifyPageURL}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">OTP kodunu bura daxil edin</a>
            <p style="font-size: 14px; color: #999;">Xoş günlər,<br>AION by Arzuui</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Əgər email sistemdə mövcuddursa, şifrə sıfırlama kodu göndərildi.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res
      .status(500)
      .json({ message: "Server xətası", error: error.message });
  }
};

export const otpVerify = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email və OTP kodu tələb olunur." });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "No user found");

    if (!user) {
      return res.status(400).json({ message: "İstifadəçi tapılmadı." });
    }

    console.log("Stored OTP:", user.otp);
    console.log("Received OTP:", otp);

    // OTP-ləri string kimi müqayisə etmək üçün, əmin olmaq üçün toString() istifadə edə bilərsiniz
    if (user.otp !== otp) { // user.otp !== otp.toString() da yoxlaya bilərsiniz
      return res.status(400).json({ message: "OTP kodu yanlışdır." });
    }

    console.log("OTP Expires:", user.otpExpires);
    console.log("Current Time:", Date.now());

    // OtpExpires Date obyekti olduğu üçün Date.now() ilə müqayisə edin
    if (Date.now() > user.otpExpires.getTime()) { // getTime() dəyərini milisaniyə çevirir
      return res.status(400).json({ message: "OTP kodunun vaxtı bitmişdir." });
    }

    console.log("OTP verification successful!");

    // OTP sahələrini sıfırla
    user.otp = undefined; // Və ya null
    user.otpExpires = undefined; // Və ya null
    await user.save(); // Dəyişiklikləri bazaya yaz!

    return res.status(200).json({
      message: "OTP kodu təsdiqləndi. İndi şifrənizi sıfırlaya bilərsiniz.",
    });
  } catch (error) {
    console.error("OTP yoxlama xətası:", error);
    return res
      .status(500)
      .json({ message: "Server xətası", error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    // Yeni şifrəni hash-ləmək
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salting round tövsiyə olunur

    // İstifadəçinin şifrəsini yenilə
    user.password = hashedPassword;
    // OTP sahələrini təmizləyin (əgər otpVerify tərəfindən təmizlənməyibsə, burada da edə bilərsiniz)
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save(); // Dəyişiklikləri bazaya yaz

    return res.status(200).json({ message: "Şifrəniz uğurla sıfırlandı." });

  } catch (error) {
    console.error("Şifrə sıfırlama xətası:", error);
    return res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const uploadUserBackgroundImage = async (req, res) => {
    // Multer faylı req.file-də yerləşdirəcək
    if (!req.file) {
        return res.status(400).json({ message: 'Şəkil yüklənməyib.' });
    }

    const user = await User.findById(req.user._id); // protect middleware-dən gələn istifadəçi

    if (!user) {
        return res.status(404).json({ message: 'İstifadəçi tapılmadı.' });
    }

    try {
        // req.file Multer tərəfindən Cloudinary-dən gələn məlumatları ehtiva edəcək
        // Əgər multer-storage-cloudinary istifadə edirsinizsə, artıq Cloudinary-ə yüklənmiş olacaq.
        user.backgroundImage = req.file.path; // req.file.path Cloudinary URL-i olacaq
        user.cloudinaryPublicId = req.file.filename; // Cloudinary public ID-sini də saxlamaq faydalıdır (silmək üçün)

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            backgroundImage: updatedUser.backgroundImage,
            token: generateToken(updatedUser._id),
            message: 'Fon şəkli uğurla yükləndi və yeniləndi.'
        });
    } catch (error) {
        console.error("Fon şəkli yüklənərkən xəta baş verdi:", error);
        res.status(500).json({ message: "Fon şəkli yüklənə bilmədi", error: error.message });
    }
};