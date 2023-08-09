import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      full_name: {
        type: String,
        default: "",
      },
      date_of_birth: Date,
      address: String,
      gender: String,
      image_profile: {
        type: String,
        default: "https://res.cloudinary.com/dcwaptlnd/image/upload/v1690374479/download_iny32w.png",
      },
      bio: {
        type: String,
        default: "",
      },
      link: {
        type: String,
        default: "",
      },
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    total_followers: {
      type: Number,
      default: 0,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    total_following: {
      type: Number,
      default: 0,
    },
    total_post: {
      type: Number,
      default: 0,
    },
    refreshtoken: String,
  },
  {
    timestamps: true,
  }
);

//Export the model
const User = mongoose.model("users", userSchema);

export default User;
