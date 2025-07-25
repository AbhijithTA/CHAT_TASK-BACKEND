import Message from "../models/Message.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verifyin the  token got from the handshake
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.id) {
        return next(new Error("Authentication error: Invalid token"));
      }

      // Find user wiht the id
      const user = await User.findById(decoded.id).lean();
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = {
        _id: user._id.toString(),
        userName: user.userName,
        email: user.emailId,
      };

      return next();
    } catch (err) {
      console.error("Authentication middleware error:", err.message);
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    if (!socket.user?._id) {
      console.error("Rejecting connection - no user:", socket.id);
      return socket.disconnect(true);
    }

    const userId = socket.user._id;

    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("user_online", { userId });

      socket.on("send_message", async ({ conversationId, content }) => {
        try {
          const message = await Message.create({
            conversationId,
            sender: userId,
            content,
          });

          const populatedMessage = await message.populate("sender", "userName");
          socket.to(conversationId).emit("receive_message", populatedMessage);
        } catch (error) {
          console.error("Message send error:", error);
        }
      });

      socket.on("disconnect", async () => {
        await User.findByIdAndUpdate(userId, { isOnline: false });
        io.emit("user_offline", { userId });
      });
    } catch (err) {
      console.error("Connection error:", err);
      socket.disconnect(true);
    }
  });
};
