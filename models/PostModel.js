import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    total_likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    total_comments: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "image",
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Post = mongoose.model("posts", postSchema);

export default Post;
