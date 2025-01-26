import Like from "../models/likeModel.js";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const getPostLikes = async (req, res) => {
  try {
    const likes = await Like.find({ post_id: req.params.postId });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: "Error receiving likes" });
  }
};

export const likePost = async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const existingLike = await Like.findOne({
      post_id: postId,
      user_id: userId,
    });
    if (existingLike)
      return res.status(400).json({ error: "The post has already been liked" });

    const like = new Like({ post_id: postId, user_id: userId });
    await like.save();

    post.likes_count += 1;
    await post.save();

    const sender = await User.findById(userId);

    const newNotification = new Notification({
      user_id: post.user_id,
      type: "Like",
      content: `liked your post.`,
      sender_id: userId,
    });
    await newNotification.save();

    res.status(201).json(like);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while liking a post" });
  }
};

export const unlikePost = async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const like = await Like.findOne({ post_id: postId, user_id: userId });
    if (!like) return res.status(404).json({ error: "Like not found" });

    await Like.findByIdAndDelete(like._id);

    const post = await Post.findById(postId);
    post.likes_count -= 1;
    await post.save();

    res.status(200).json({ message: "Like removed" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting like" });
  }
};

export const getUserLikes = async (req, res) => {
  const { userId } = req.params;

  try {
    const likes = await Like.find({ user_id: userId }).select("post_id");
    res.status(200).json(likes.map((like) => like.post_id));
  } catch (error) {
    res.status(500).json({ error: "Error getting user likes" });
  }
};
