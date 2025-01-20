import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, "UUID must be provided."],
        unique: true
    },

    f_name: {
        type: String,
        required: [true, "First name must be provided."]
    },

    l_name: {
        type: String,
        required: [true, "Last name must be provided."]
    },

    username: {
        type: String,
        required: [true, "Username must be provided."],
        unique: true
        //[true, 'Username is already in use.']
    },

    email: {
        type: String,
        required: [true, "Email must be provided."],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password must be provided."]
    },

    imgUrl: {
        type: String
    },

    verified: {
        code: {
            type: String,
            expires: 300
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpires: Number
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;