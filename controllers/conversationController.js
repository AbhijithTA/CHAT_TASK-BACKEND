import Conversation from "../models/Conversation.js";


//conversation controller for creating or getting
export const getOrCreateConversation = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User id is required" });

  try {
    //checking if the conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, req.user._id] },
    }).populate("participants", "userName email");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, req.user._id],
      });
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "userName email"
      );
    }

    res.status(200).json({
      conversation: conversation,
    });
  } catch (err) {
    console.error("Error in getOrCreateConversation:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


