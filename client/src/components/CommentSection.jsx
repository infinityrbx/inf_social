import {
  Avatar,
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { formatDistanceToNow } from "date-fns";

const CommentSection = ({
  comments,
  commentAuthors,
  isComments,
  newComment,
  setNewComment,
  handlePostComment,
  deleteComment,
  loggedInUserId,
}) => {
  return (
    isComments && (
      <Box mt="0.5rem">
        {comments.map((comment) => {
          const author = commentAuthors[comment.userId];
          const key = `${comment._id}-${Math.random()}`;
          const showDeleteButton = comment.userId === loggedInUserId;
          const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          });
          return (
            <Box key={key}>
              <Box display="flex" alignItems="flex-start" gap="1rem">
                {author && (
                  <Avatar
                    src={`${author.picturePath}`}
                    sx={{ width: 50, height: 50 }}
                  />
                )}
                <Box>
                  <Typography
                    sx={{ color: "text.primary", fontWeight: "bold" }}
                  >
                    {author
                      ? `${author.firstName} ${author.lastName}`
                      : "Unknown Author"}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>{timeAgo}</Typography>
                  <Typography sx={{ color: "text.primary", m: "0.5rem 0" }}>
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
              <Divider sx={{ margin: "0.5rem 0" }} />
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
            disabled={newComment.trim() === ""}
          >
            Post
          </Button>
        </FlexBetween>
      </Box>
    )
  );
};

export default CommentSection;
