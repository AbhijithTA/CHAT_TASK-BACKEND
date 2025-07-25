import User from "../models/User.js";
import jwt from "jsonwebtoken";


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


//user registration controller
export const registerUser = async (req, res) => {
  try {
    const { userName, emailId, password } = req.body;
   
    if (!userName || !emailId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ emailId });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ userName, emailId, password });

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      emailId: user.emailId,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error in user creation", err });
   
  }
};

//user login controller
export const loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ emailId });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      emailId: user.emailId,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error in user login", err });
  }
};
