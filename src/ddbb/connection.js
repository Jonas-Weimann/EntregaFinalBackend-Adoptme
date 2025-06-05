import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const initMongoDB = async () => {
  try {
    await connect(process.env.MONGODB_URI, { dbName: "AdoptMe" });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};
