import User from "../models/userModel.js";
import getUserIdFromToken from "../utils/helpers.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import stream from "stream";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId).select("-password -created_at");
    if (!user) {
      return res.status(404).json({ message: "User is not find" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error occured while fetching user's data",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = getUserIdFromToken(req);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    const { username, bio, bio_website } = req.body;

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (bio_website) user.bio_website = bio_website;

    if (req.file) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      try {
        const cloudinaryUpload = await new Promise((resolve, reject) => {
          bufferStream.pipe(
            cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
          );
        });

        user.profile_image = cloudinaryUpload.secure_url;
      } catch (error) {
        return res.status(500).json({
          message: "Error loading image",
          error: error.message,
        });
      }
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Profile update error", error: error.message });
  }
};

export const uploadProfileImage = upload.single("profile_image");

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error getting users",
      error: error.message,
    });
  }
};
