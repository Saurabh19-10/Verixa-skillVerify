import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, message, messageType = "text", attachment = "" } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required",
      });
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      message,
      messageType,
      attachment,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email role avatar")
      .populate("receiver", "name email role avatar");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      chat: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name email role avatar")
      .populate("receiver", "name email role avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .populate("sender", "name email role avatar")
      .populate("receiver", "name email role avatar")
      .sort({ createdAt: -1 });

    const chatMap = new Map();

    messages.forEach((msg) => {
      const senderId = msg.sender._id.toString();
      const receiverId = msg.receiver._id.toString();
      const currentUserId = req.user._id.toString();

      const otherUser =
        senderId === currentUserId ? msg.receiver : msg.sender;

      const otherUserId = otherUser._id.toString();

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unread: 0,
        });
      }

      if (
        receiverId === currentUserId &&
        !msg.isRead
      ) {
        chatMap.get(otherUserId).unread += 1;
      }
    });

    const chats = Array.from(chatMap.values());

    res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};