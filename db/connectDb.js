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
  } finally {
    // Ensures that the client will close when you finish/error
    // console.log("disconnect");
    // await mongoose.disconnect();
  }
}
