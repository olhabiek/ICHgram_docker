import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const loadMessages = async (userId, targetUserId, socket) => {
  console.log("userId", userId);
  console.log("targetUserId", targetUserId);
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: targetUserId },
        { sender_id: targetUserId, receiver_id: userId },
      ],
    }).sort({ created_at: 1 });
    socket.emit("loadMessages", messages);
  } catch (error) {
    console.error("Error loading messages:", error);
    socket.emit("error", { error: "Error loading messages" });
  }
};

export const sendMessage = async (
  userId,
  targetUserId,
  messageText,
  roomId,
  io
) => {
  try {
    const message = new Message({
      sender_id: userId,
      receiver_id: targetUserId,
      message_text: messageText,
      created_at: new Date(),
    });

    await message.save();

    io.emit("receiveMessage", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const getUsersWithChats = async (req, res) => {
  const userId = req.user._id;
  console.log("Current user ID:", userId);

  try {
    const sentIds = await Message.find({ sender_id: userId }).distinct(
      "receiver_id"
    );
    const receivedIds = await Message.find({ receiver_id: userId }).distinct(
      "sender_id"
    );

    const userIds = [...new Set([...sentIds, ...receivedIds])];

    const users = await User.find({ _id: { $in: userIds } })
      .select("-password")
      .lean();

    const usersDTO = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.find({
          $or: [
            { sender_id: userId, receiver_id: user._id },
            { sender_id: user._id, receiver_id: userId },
          ],
        })
          .sort({ created_at: -1 })
          .limit(1);

        return {
          ...user,
          lastMessage: lastMessage[0] ? lastMessage[0].created_at : null,
        };
      })
    );

    res.status(200).json(usersDTO);
  } catch (error) {
    console.error("Error loading users:", error);
    res.status(500).json({
      message: "Error loading users",
      error: error.message,
    });
  }
};
