import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    }).lean();

    if (!conversation) {
      return res
        .status(403)
        .json({ message: "Not authorized for this conversation" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "userName email");

    res.status(200).json({
      messages: messages.reverse(),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(
          (await Message.countDocuments({ conversationId })) / limit
        ),
        totalMessages: await Message.countDocuments({ conversationId }),
      },
    });
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMessage = async (req, res) => {
  const { conversationId, content } = req.body;

  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      console.error(
        `Conversation not found or user not authorized. Conversation: ${conversationId}, User: ${req.user._id}`
      );
      return res
        .status(403)
        .json({ message: "Not authorized for this conversation" });
    }

    // Creating a new message
    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      content,
    });

    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate("sender", "userName email");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
