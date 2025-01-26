import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import generateToken from "../config/jwt.js";

export const register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      const errors = {};
      if (existingUser.email === email) {
        errors.email = "This email is already taken";
      }
      if (existingUser.username === username) {
        errors.username = "This username is already taken";
      }

      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      full_name,
    });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Authorisation error", error: error.message });
  }
};

export const checkUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(200).json({ message: "User found" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "The required data was not transmitted" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ message: "Error updating password:", error: error.message });
  }
};
