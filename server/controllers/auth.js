import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import oauth2Client from "../utils/oauth2client.js";
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

    const newUser = new User({
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

// ... other functions (register, login) ...

export const googleAuth = async (req, res) => {
  try {
    const code = req.query.code; // Extract code from query parameter

    console.log("USER CREDENTIAL -> ", code);

    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      {
        method: "GET",
      }
    );

    let user = await User.findOne({ email: userRes.data.email });

    const userData = await userRes.json();

    // Find or create the user in your database

    if (!user) {
      // Create a new user if they don't exist
      const newUser = new User({
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        password: await bcrypt.hash(userData.id, 10), // Hash a random ID for security
        picturePath: userData.picture,
        // Other fields as needed (occupation, location, etc.)
      });
      user = await newUser.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // Don't send the password back to the client

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(
      "Error in googleAuth:",
      err.response ? err.response.data : err
    );
    res.status(500).send({ error: err.message });
  }
};
