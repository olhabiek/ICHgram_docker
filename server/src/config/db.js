import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
      // pass: process.env.MONGO_INITDB_ROOT_PASSWORD || "",
      dbName: process.env.MONGO_INITDB_DATABASE,
    });
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error while connecting database: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
