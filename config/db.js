import mongoose from "mongoose";

export const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_URL);
    console.log("Database Connected");
  } catch (error) {
    throw new Error(error);
  }
};
