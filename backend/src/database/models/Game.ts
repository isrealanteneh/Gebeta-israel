import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    challenger: {
        id: { type: String, required: true },
        username: { type: String, required: true },
        name: { type: String, required: true }
    },
    challengee: {
        id: { type: String, required: true },
        username: { type: String, required: true },
        name: { type: String, required: true }
    },
    status: { type: String, default: "pending" },
    moves: { type: Array, default: [] },
    winner: {
        type: String,
        default: null,
        validate: {
            validator: function (value: string) {
                return value === null || value === this.challenger.id || value === this.challengee.id;
            },
            message: "Winner must be either the challenger or challengee."
        }
    }
});

const GameModel = mongoose.model("Game", gameSchema);
export default GameModel;