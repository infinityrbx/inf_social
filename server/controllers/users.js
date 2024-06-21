import User from "../models/Users.js";
/* READ */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findById(id);
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId", userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (id === friendId) {
      return res
        .status(400)
        .json({ message: "Cannot add/remove yourself as a friend" });
    }

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    const friendIndex = user.friends.indexOf(friendId);

    if (friendIndex !== -1) {
      user.friends.splice(friendIndex, 1);
      const userFriendIndex = friend.friends.indexOf(id);
      friend.friends.splice(userFriendIndex, 1);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    // Format friend's data
    const friends = await Promise.all(
      user.friends.map((id) =>
        User.findById(id).select(
          "firstName lastName occupation location picturePath"
        )
      )
    );

    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const setFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isFrozen: true },
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // if (req.user.id !== req.params.id) {
    //   return res.status(403).send("Access Denied");
    // }

    await User.findByIdAndDelete(id);
    res.status(201).json("User has been deleted");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
