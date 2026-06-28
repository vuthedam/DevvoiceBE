import mongoose from "mongoose";
import { configenv } from "./configenv.js";

export default function connectDB() {
  mongoose
    .connect(configenv.MONGODB_URI)
    .then(() => {
      console.log("Connect database successfully!");
    })
    .catch((err) => {
      console.log(`Connect DB error: ${JSON.stringify(err)}`);
    });
}
