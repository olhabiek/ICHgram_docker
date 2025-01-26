import { ObjectId } from "mongodb";

import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const getUserFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({
      user_id: req.params.userId,
    }).populate("follower_user_id", "username");
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: "Error getting subscribers" });
  }
};

export const getUserFollowing = async (req, res) => {
  try {
    const following = await Follow.find({
      follower_user_id: req.params.userId,
    }).populate("follower_user_id", "username");
    res.status(200).json(following);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Error getting list of subscriptions" });
  }
};

export const followUser = async (req, res) => {
  const { userId, targetUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingFollow = await Follow.findOne({
      follower_user_id: userId,
      followed_user_id: targetUserId,
    });
    if (existingFollow) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    const follow = new Follow({
      follower_user_id: userId,
      user_id: targetUserId,
      created_at: new Date(),
    });

    user.following_count += 1;
    targetUser.followers_count += 1;

    await user.save();
    await targetUser.save();
    await follow.save();

    const notification = new Notification({
      user_id: targetUser.id,
      type: "Follow",
      content: `started following.`,
      sender_id: userId,
    });

    await notification.save();

    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: "Error subscribing to user" });
  }
};

export const unfollowUser = async (req, res) => {
  const { userId, targetUserId } = req.params;
  console.log("userId", userId);
  console.log("targetUserId", targetUserId);
  try {
    const follow = await Follow.findOne({
      user_id: new ObjectId(userId),
      follower_user_id: new ObjectId(targetUserId),
    });
    console.log(follow);
    if (!follow) {
      return res
        .status(404)
        .json({ error: "You are not subscribed to this user" });
    }

    await Follow.findByIdAndDelete(follow._id);

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    user.following_count -= 1;
    targetUser.followers_count -= 1;

    await user.save();
    await targetUser.save();

    const notification = new Notification({
      user_id: targetUser.id,
      type: "Unfollow",
      content: `stopped following.`,
      sender_id: userId,
    });
    await notification.save();

    res.status(200).json({ message: "You have unsubscribed from the user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error unsubscribing from user" });
  }
};
