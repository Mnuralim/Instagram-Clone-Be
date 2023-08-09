import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user based on email
    const findUser = await User.findOne({ email });
    if (!findUser) return res.status(400).json({ message: "User not found" });

    //const matching pasword
    const match = await bcrypt.compare(password, findUser.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    //generate token and refresh token
    const userId = findUser._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const refreshtoken = jwt.sign({ findUser }, process.env.REFRESH_SECRET, {
      expiresIn: "1d",
    });

    await User.findByIdAndUpdate(
      userId,
      {
        refreshtoken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Success",
      data: {
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
        token: token,
        profile_image: findUser.profile.image_profile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    const { refreshtoken } = req.cookies;
    //check token
    if (!refreshtoken) return res.sendStatus(204);
    await User.findOneAndUpdate(
      { refreshtoken: refreshtoken },
      {
        refreshtoken: null,
      }
    );
    res.clearCookie("refreshtoken");
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshtoken } = req.body;
    console.log(refreshtoken);
    if (!refreshtoken) return res.sendStatus(401);

    const user = await User.findOne({
      refreshtoken: refreshtoken,
    });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshtoken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user._id;

      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: "An error ocured", error: error.message });
  }
};
