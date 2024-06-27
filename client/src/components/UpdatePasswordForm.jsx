import { Box, TextField, Button, Alert, DialogActions } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export const UpdatePasswordForm = ({onClose}) => {
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    newpasswordconfirm: "",
  });
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    if (formData.newpassword !== formData.newpasswordconfirm) {
      setError("New passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`https://inf-social.onrender.com/auth/updatePwd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldpassword: formData.oldpassword,
          newpassword: formData.newpassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }
      alert("Your password has been changed!");
      onClose()
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: "500px",
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        name="oldpassword"
        label="Old Password"
        type="password"
        value={formData.oldpassword}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="newpassword"
        label="New Password"
        type="password"
        value={formData.newpassword}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="newpasswordconfirm"
        label="Confirm"
        type="password"
        value={formData.newpasswordconfirm}
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


