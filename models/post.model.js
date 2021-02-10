const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500,
            required: true,
        },
        likers: {
            type: [String],
            required: true,
        },
        comments: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    message: String,
                    timestamp: Number,
                }
            ],
            require: true
        },
    },
    {
        timestamps: true,
    }
)

const PostModel = mongoose.model('post', postSchema);
module.exports = PostModel;