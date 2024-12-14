import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

//schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstname is required'],
    },
    lastName: {
        type: String,
        required: [true, 'lastname is required'],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, "Password should be greater than 6 characters"],
        select:true,
    },
    location: {
        type: String,
        default: 'warangal',
    }
}, { timestamps: true });

//hashing password
userSchema.pre("save", async function () {
    if (!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//compare password 
userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword,this.password)
    return isMatch;
}

//jwt
userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET,{expiresIn:'1d'});
}

export default mongoose.model("User", userSchema);