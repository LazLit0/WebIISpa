var mongoose = require("mongoose");

const ForumThreadSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        ownerID: String
    }
)

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema);

module.exports = ForumThread;