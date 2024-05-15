import "dotenv/config";
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

export async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
}
