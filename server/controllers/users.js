import user from "../models/user";

/* READ */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await user.findbyId(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await user.findbyId(id);

    const friends = await Promise.all(
      user.friends.map((id) => user.findbyId(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200);
  } catch (err) {
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await user.findbyId(id);
    const friends = await user.findbyId(friendId);

    if (user.friend.includes(friendId)) {
      user.friends;
    }
  } catch (err) {
    res.status(404).json({ message: error.message });
  }
};
