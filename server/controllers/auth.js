import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const pwdHash = await bcrypt.hash(password, salt);

    const newUser = new user({
      firstName,
      lastName,
      email,
      password: pwdHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: "0",
      impressions: "0",
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).send({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};
