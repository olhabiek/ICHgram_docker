import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import stream from "stream";

import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import getUserIdFromToken from "../utils/helpers.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: getUserIdFromToken(req) });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error when fetching posts" });
  }
};

export const createPost = async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { caption } = req.body;

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    let image_url = "test";

    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Loading error" });
        }
        image_url = result.secure_url;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!req.file)
          return res.status(400).json({ error: "Image not provided" });

        const post = new Post({
          user_id: userId,
          image_url,
          user_name: user.username,
          profile_image: user.profile_image,
          caption,
          created_at: new Date(),
        });

        await post.save();

        user.posts_count += 1;
        await user.save();

        res.status(201).json(post);
      })
      .end(req.file.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post" });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post is not found" });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(post.user_id);
    user.posts_count -= 1;
    await user.save();

    res.status(200).json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("user_id", "username");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { caption } = req.body;

  console.log("Received request body:", req.body);
  console.log("Received request file:", req.file);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (caption !== undefined) {
      post.caption = caption;
    }

    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result.secure_url);
              resolve(result);
            }
          })
          .end(req.file.buffer);
      });

      post.image_url = uploadResult.secure_url;
    }

    console.log("Saving post to database...");
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error updating post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate(
      "user_id",
      "username profile_image"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error getting all posts" });
  }
};

export const getOtherUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const posts = await Post.find({ user_id: user_id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error while retrieving posts" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const user = await User.findById(userId).populate("following", "_id");
    const followingIds = user.following.map((followedUser) => followedUser._id);

    const posts = await Post.find({ user_id: { $in: followingIds } })
      .populate("user_id", "username profile_image")
      .sort({ created_at: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while getting posts from subscribed users" });
  }
};
