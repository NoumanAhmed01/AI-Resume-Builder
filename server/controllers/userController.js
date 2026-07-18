import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

//POST: api/users/register
//Controller for user registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check required field are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //check user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //return success message
    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//POST: api/users/login
//Controller for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //verify password
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //return success message
    const token = generateToken(user._id);
    user.password = undefined;

    return res
      .status(201)
      .json({ message: "User login successfully", token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//POST: api/users/data
//Controller for getting user by id
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    //check if user exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", token, user });
    }

    //return user
    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//GET: /api/users/resumes
//Controller for getting user resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    //return user resumes
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
