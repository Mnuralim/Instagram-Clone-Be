import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    text: String,
  },
  {
    timestamps: true,
  }
);

//Export the model
const Comment = mongoose.model("comments", CommentSchema);

export default Comment;
