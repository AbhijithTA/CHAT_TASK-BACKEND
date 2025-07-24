import Conversation from "../models/Conversation.js";

export const getOrCreateConversation = async (req, res) => {
  const { userId } = req.body;

  try {
    //checking if the conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, req.user._id] },
    });

    if (!conversation) {
      conversation = new Conversation.create({
        participants: [userId, req.user._id],
      });
    }

    res.status(200).json({
      conversation: conversation,
    });
  } catch (err) {
    console.error("Error in getOrCreateConversation:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
