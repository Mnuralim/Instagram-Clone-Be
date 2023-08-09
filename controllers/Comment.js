import Comment from "../models/CommentModel.js";
import Post from "../models/PostModel.js";

export const createComment = async (req, res) => {
  const { comment } = req.body;
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    //add new comment
    const newComment = await Comment.create({
      text: comment,
      post: postId,
      user: userId,
    });

    //add new comment to list
    const post = await Post.findById({ _id: postId });
    post.comments.push(newComment.id);
    post.total_comments = post.comments.length;
    await post.save();

    res.status(200).json({ message: "Success", data: newComment });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getAllComment = async (req, res) => {
  const { postId } = req.params;
  try {
    //get comment data
    const getCommentData = await Comment.find({ post: postId }).populate("user").sort("-createdAt");
    res.status(200).json({ message: "Success", data: getCommentData });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    //delete comment
    const removeComment = await Comment.findByIdAndDelete({ _id: id });
    const post = await Post.findById({ _id: removeComment.post });
    post.comments.pull(removeComment._id);
    post.total_comments = post.comments.length;
    await post.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};
