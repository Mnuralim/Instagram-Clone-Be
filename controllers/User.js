import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const emailExists = await User.findOne({ email: email });
  const usernameExists = await User.findOne({ username: username });

  if (emailExists) return res.status(400).json({ message: "Email already exists" });
  if (usernameExists) return res.status(400).json({ message: "Username already exists" });

  try {
    //check if email and username already exxists

    //hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(200).json({ message: "success", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const data = await User.find().select("-password -refreshtoken -__v");
    res.status(200).json({ message: "success", data });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.user;
  const { fullname, username, bio, link } = req.body;

  const user = await User.findById(id);
  const imageProfile = user.profile.image_profile;

  //image upload
  let urlPath;
  const file = req.file;
  console.log(file);
  if (file) {
    urlPath = file.path;
  } else {
    urlPath = imageProfile;
  }

  try {
    //update user
    const userUpdate = await User.findByIdAndUpdate(
      id,
      {
        profile: {
          full_name: fullname,
          image_profile: urlPath,
          bio: bio,
          link: link,
        },
        username: username,
      },
      {
        new: true,
      }
    );
    res.status(201).json({ message: "Success", data: userUpdate });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getMyProfileData = async (req, res) => {
  const id = req.user.id;
  try {
    const myProfile = await User.findById({ _id: id }).select("-__v");
    res.status(200).json({ message: "Success", data: myProfile });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const findUserById = async (req, res) => {
  const { username } = req.params;
  try {
    const singleData = await User.findOne({ username: username }).select("-password -refreshtoken -__v");
    res.status(200).json({ message: "Success", data: singleData });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const follow = async (req, res) => {
  const userId = req.user.id;
  const { username } = req.params;

  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findOne({ username: username });

    //check if user id and follower id same or not
    if (userId === userToFollow._id) return res.status(400).json({ message: "You cannot follow/unfollow yourself" });

    //check if user already following follower or not
    const alreadyFollow = user.following.find((data) => data.toString() === userToFollow._id.toString());
    console.log(alreadyFollow);

    let result;
    if (!alreadyFollow) {
      user.following.push(userToFollow._id);
      userToFollow.followers.push(user._id);

      //update number of follower and following
      user.total_following = user.following.length;
      userToFollow.total_followers = userToFollow.followers.length;

      await user.save();
      await userToFollow.save();
      result = "You are now following the user";
    } else {
      user.following.pull(userToFollow._id);
      userToFollow.followers.pull(user._id);

      //update number of follower and following
      user.total_following = user.following.length;
      userToFollow.total_followers = userToFollow.followers.length;

      await user.save();
      await userToFollow.save();
      result = "You have unfollowed the user";
    }
    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const getDataFollow = async (req, res) => {
  const userId = req.user.id;
  const { username } = req.params;
  const userToFollow = await User.findOne({ username: username });
  const idUserToFollow = userToFollow.id;

  try {
    const user = await User.findById(userId);
    const alreadyFollow = user.following.find((data) => data.toString() === idUserToFollow);
    let result;
    if (alreadyFollow) {
      result = true;
    } else {
      result = false;
    }
    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};
