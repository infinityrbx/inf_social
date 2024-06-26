import { Box, TextField, Button, Alert, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UserDetailEditForm = ({ userId, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    occupation: "",
  });
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://inf-social.onrender.com/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserData();
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://inf-social.onrender.com/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          occupation: formData.occupation,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: "500px",
      }}
    >
      <TextField
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="location"
        label="Location"
        value={formData.location}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="occupation"
        label="Occupation"
        value={formData.occupation}
        onChange={handleChange}
        fullWidth
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Box>
  );
};

export default UserDetailEditForm;
