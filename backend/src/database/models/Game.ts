import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    players: [{
        type: String,
        required: true
    }]
});

const GameModel = mongoose.model("Game", gameSchema);
export default GameModel;