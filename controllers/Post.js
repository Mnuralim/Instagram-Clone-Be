import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";

export const createPost = async (req, res) => {
  const { caption, category } = req.body;
  const userId = req.user.id;
  const file = req.file;
  const urlPath = file.path;
  console.log(file);

  try {
    //create new post
    const newPost = await Post.create({
      caption: caption,
      media: urlPath,
      user_id: userId,
      category: category,
      created_at: Date.now(),
    });
    const post = await Post.find({ user_id: userId }).select("user_id");
    const totalPost = post.length;
    await User.findByIdAndUpdate(
      userId,
      {
        total_post: totalPost,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Success", data: newPost });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getAllPost = async (req, res) => {
  try {
    //get all post data
    const allPost = await Post.find().populate("comments").populate("likes").populate("user_id").sort({ createdAt: -1 });
    res.status(200).json({ message: "Success", data: allPost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getAllMyPost = async (req, res) => {
  const userid = req.user.id;
  try {
    //get all post data
    const allPost = await Post.find({ user_id: userid }).populate("comments").populate("likes").populate("user_id");
    res.status(200).json({ message: "Success", data: allPost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    //get single post
    const singlePost = await Post.findById({ _id: id }).populate("comments").populate("likes").populate("user_id");
    res.status(200).json({ message: "Success", data: singlePost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getMyPostById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    //get single post
    const singlePost = await Post.findOne({ _id: id, user_id: userId }).populate("comments").populate("likes").populate("user_id");
    console.log(singlePost);
    res.status(200).json({ message: "Success", data: singlePost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getOtherUserPost = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("_id");
  const userId = user._id;

  try {
    const allPost = await Post.find({ user_id: userId }).populate("comments").populate("likes");
    console.log(allPost);
    res.status(200).json({ message: "Success", data: allPost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;

  try {
    //update post
    const editPost = await Post.findByIdAndUpdate(
      id,
      {
        caption: caption,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Success", data: editPost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    //delete post
    const removePost = await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Success", data: removePost });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const likes = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    //check data already liked or not

    const post = await Post.findById(id);
    const alreadyLiked = post.likes.find((data) => data.toString() === userId);

    let result;
    if (!alreadyLiked) {
      post.likes.push(userId);
      result = await post.save();
    } else {
      post.likes.pull(userId);
      result = await post.save();
    }
    //number of likes
    const numberLikes = post.likes.length;
    post.total_likes = numberLikes;
    await post.save();
    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const alreadyLiked = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(id);
    const alreadyLiked = post.likes.find((data) => data.toString() === userId);
    let result;
    if (alreadyLiked) {
      result = true;
    } else {
      result = false;
    }
    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getNumberoFLike = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    const totalLikes = post.total_likes;
    res.status(200).json({ message: "Success", data: totalLikes });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};
