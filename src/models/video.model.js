import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // from cloudinary
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

// Text index for efficient search on title and description
videoSchema.index({ title: "text", description: "text" }, { weights: { title: 10, description: 1 } });

// Compound index for querying videos by owner, sorted by creation date
videoSchema.index({ owner: 1, createdAt: -1 });

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);