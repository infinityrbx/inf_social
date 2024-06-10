import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "states";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = likes ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = likes ? Object.keys(likes).length : 0;
  const [newComment, setNewComment] = useState("");

  const { palette } = useTheme();
  const primary = palette.primary.main;
  const main = palette.neutral.main;

  const handlePostComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            comment: newComment,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const patchLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  const [commentAuthors, setCommentAuthors] = useState({});
  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/posts/${postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const deletePost = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:3005/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // On successful deletion, you might redirect or update UI
        // For example, you could dispatch an action to remove the post from your state
        // Or reload the page
        window.location.reload();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchAuthor = async (userId) => {
      try {
        const response = await fetch(`http://localhost:3005/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching author details:", error);
        return null;
      }
    };
    const uniqueUserIds = [
      ...new Set(comments.map((comment) => comment.userId)),
    ];
    Promise.all(uniqueUserIds.map(fetchAuthor)).then((authors) => {
      const authorLookup = {};
      authors.forEach((author) => {
        if (author) {
          authorLookup[author._id] = author;
        }
      });
      setCommentAuthors(authorLookup);
    });
  }, [comments]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem" }}
          src={`http://localhost:3005/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            {postUserId === loggedInUserId && ( // Show delete button only for the post author
              <IconButton disabled={isDeleting} onClick={deletePost}>
                <DeleteOutlineOutlined sx={{ color: "error.main" }} />
              </IconButton>
            )}
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment) => {
            const author = commentAuthors[comment.userId];
            const key = `${comment._id}-${Math.random()}`;
            const showDeleteButton = comment.userId === loggedInUserId;
            return (
              <Box key={key}>
                {" "}
                <Box display="flex" alignItems="flex-start" gap="1rem">
                  {author && (
                    <Avatar
                      src={`http://localhost:3005/assets/${author.picturePath}`}
                      sx={{ width: 50, height: 50 }}
                    />
                  )}
                  <Box>
                    <Typography sx={{ color: main, fontWeight: "bold" }}>
                      {author
                        ? `${author.firstName} ${author.lastName}`
                        : "Unknown Author"}
                    </Typography>
                    <Typography sx={{ color: main, m: "0.5rem 0" }}>
                      {comment.comment}
                    </Typography>
                  </Box>
                </Box>
                <FlexBetween>
                  {showDeleteButton && (
                    <IconButton
                      size="small"
                      onClick={() => deleteComment(comment._id)}
                    >
                      <DeleteOutlineOutlined sx={{ color: "error.main" }} />
                    </IconButton>
                  )}
                </FlexBetween>
                <Divider sx={{ margin: "0.5rem 0" }} />{" "}
              </Box>
            );
          })}
          <FlexBetween gap="1rem">
            <TextField
              label="Add a comment..."
              variant="outlined"
              size="small"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handlePostComment}
              disabled={newComment.trim() === ""} // Disable if comment is empty
            >
              Post
            </Button>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
