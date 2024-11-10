import mongoose from "mongoose";

const revokedTokensSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    revokedAt: {
        type: Number,
        default: Date.now
    }
});

const RevokedTokenModel = mongoose.model("RevokedTokens", revokedTokensSchema);
export default RevokedTokenModel;