import React, { useState, useEffect } from "react";

import SortReport from "../components/SortReport";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Pagination,
  Divider,
} from "@mui/material";

const CommentModal = ({
  isOpen,
  onClose,
  comments,
  reportId,
  addComment,
  updateComment,
  currentUserId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [commentIdToUpdate, setCommentIdToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("latest");
  const commentsPerPage = 4;

  useEffect(() => {
    if (!isOpen) {
      setIsUpdating(false);
      setNewComment("");
      setCommentIdToUpdate(null);
    }
  }, [isOpen]);

  // Sorting logic for comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.timestamp) - new Date(a.timestamp); // Sort by latest first
    }
    return new Date(a.timestamp) - new Date(b.timestamp); // Sort by oldest first
  });

  // Pagination logic for comments
  const totalComments = sortedComments.length;
  const totalPages = Math.ceil(totalComments / commentsPerPage);
  const currentComments = sortedComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      if (isUpdating) {
        // If updating, call updateComment function
        updateComment(reportId, commentIdToUpdate, newComment);
      } else {
        // If adding, call addComment function
        addComment(reportId, newComment);
      }
      setIsUpdating(false);
      setCommentIdToUpdate(null);
      setNewComment("");
    }
  };

  // Handle updating a comment
  const handleUpdateClick = (commentId, commentDesc) => {
    setIsUpdating(true);
    setCommentIdToUpdate(commentId);
    setNewComment(commentDesc);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="comments-modal-title"
      aria-describedby="comments-modal-description"
      // sx={{ overflowY: "auto", maxHeight: "300px" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          bgcolor: "background.paper",
          // border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          maxHeight: "800px",
        }}
      >
        <Typography
          id="comments-modal-title"
          variant="h6"
          component="h2"
          mb={2}
        >
          Comments
        </Typography>

        <SortReport sortOption={sortOption} setSortOption={setSortOption} />
        <Divider sx={{ mt: 2 }} />

        <Box
          component="ul"
          sx={{ mt: 3, listStyle: "none", p: 0, overflowY: "auto" }}
        >
          {currentComments.map((comment) => (
            <Box component="li" key={comment._id} sx={{ mb: 2 }}>
              <Typography variant="body1">
                {comment.desc.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
              <Typography variant="caption" display="block" mt={2}>
                <Box component="span" sx={{ mr: 1 }}>
                  By: {comment.createdBy.userName}
                </Box>
                <Box component="span" sx={{ ml: 1 }}>
                  Last modified:{" "}
                  {new Date(comment.timestamp).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </Box>
              </Typography>

              {comment.createdBy._id === currentUserId && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleUpdateClick(comment._id, comment.desc)}
                >
                  Update
                </Button>
              )}
              <Divider component="li" sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>

        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isUpdating ? "Update your comment" : "Add a comment"}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            {isUpdating ? "Update Comment" : "Add Comment"}
          </Button>
        </Box>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} variant="text">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommentModal;
