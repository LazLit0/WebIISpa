var mongoose = require("mongoose");

const ForumThreadSchema = new mongoose.Schema(
    {
        threadID: { type: String, unique: true },
        name: String,
        description: String,
        owner: String
    }
)

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema);

module.exports = ForumThread;