var mongoose = require("mongoose");

const ForumThreadSchema = new mongoose.Schema(
    {
        forumThreadID: { type: String, unique: true},
        name: String,
        description: String
    }
)

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema);

module.exports = ForumThread;