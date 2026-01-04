const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },

    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    },
    providerId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model("User", userSchema)
module.exports = User;