import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Zəhmət olmasa düzgün email daxil edin'],
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 60,
      },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
    ,
    isVerified: { type: Boolean, default: false },
    emailToken: String,
    emailTokenExpires: Date,
     otp: { type: String },         
    otpExpires: { type: Date }, 

}, { timestamps: true })

export default mongoose.model("User", UserSchema)