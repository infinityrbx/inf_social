import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Dialog,
  DialogContent,
} from "@mui/material";
import UserPicture from "components/UserPicture";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import UserDetailEditForm from "components/UserDetailEditForm";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(
      `https://inf-social.onrender.com/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    getUser();
  };

  return (
    <WidgetWrapper>
      {/* 1st ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <UserPicture image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              onClick={() => navigate(`/profile/${userId}`)}
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined
          sx={{ color: main, cursor: "pointer" }}
          onClick={handleOpenDialog}
        />
      </FlexBetween>

      <Divider />
      {/* 2nd ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>
      <Divider />

      {/* 3rd ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>
      {/* 4th ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img
              src="https://inf-social.onrender.com/assets/twitter.png"
              alt="twitter"
            />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img
              src="https://inf-social.onrender.com/assets/linkedin.png"
              alt="linkedin"
            />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box>

      <Dialog open={openDialog}>
        <DialogContent>
          <UserDetailEditForm userId={userId} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </WidgetWrapper>
  );
};

export default UserWidget;
