import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import User from "../models/Users.js";
/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const pwdHash = await bcrypt.hash(password, salt);

    let picturePath = null;
    if (req.file) {
      // Check if a file was uploaded
      picturePath = await new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result.secure_url); // Get the secure URL from Cloudinary
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    } else {
      // Set a default profile picture if no image is provided
      picturePath = "path/to/default/profile/image.jpg";
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: pwdHash,
      picturePath, // Use the picturePath
      friends,
      location,
      occupation,
      viewedProfile: 0, // Initialize as numbers
      impressions: 0,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    // Enhanced Error Handling
    console.error("Registration Error:", err); // Log the detailed error
    if (err.code === 11000) {
      // MongoDB duplicate key error
      res.status(409).json({ message: "User with this email already exists" });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error during registration" });
    }
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    console.log(user);
    if (!user)
      return res
        .status(400)
        .json({ msg: "User name or Password isn't correct. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "User name or Password isn't correct." });

    await User.findByIdAndUpdate(user._id, { isFrozen: false });
    user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).send({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};
