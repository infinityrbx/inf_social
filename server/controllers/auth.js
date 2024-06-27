import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import User from "../models/Users.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

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

    let picturePath = "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?w=300&ssl=1";
    if (req.file) {
      picturePath = await new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: pwdHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: 0,
      impressions: 0,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Registration Error:", err);
    if (err.code === 11000) {
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
    const token = signToken(user._id);
    delete user.password;
    res.status(200).send({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const oldPassword = req.body.oldpassword
    const newPassword = req.body.newpassword
    const user = await User.findById(userId)
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Old password isn't correct." });
        
    const salt = await bcrypt.genSalt();
    const pwdHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
      userId,
      { $set: {password: pwdHash} },
    );
    res.status(201).json("Password has changed");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};