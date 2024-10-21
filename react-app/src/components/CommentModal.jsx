import Modal from "react-modal";
import { useState, useEffect } from "react";
import ReportPagination from "./ReportPagination";
import SortReport from "../components/SortReport";

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
  const commentsPerPage = 5;

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

  const handlePageChange = (newPage) => {
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
    setIsUpdating(true); // Switch form to update mode
    setCommentIdToUpdate(commentId); // Set the ID of the comment to update
    setNewComment(commentDesc); // Prefill the form with the comment description
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Comments</h2>
      <SortReport sortOption={sortOption} setSortOption={setSortOption} />
      <ul>
        {currentComments.map((comment) => (
          <li key={comment._id}>
            <p>{comment.desc}</p>
            <small>By: {comment.createdBy.userName}</small>
            <small>{new Date(comment.timestamp).toLocaleDateString()}</small>

            {comment.createdBy._id === currentUserId && (
              <button
                onClick={() => handleUpdateClick(comment._id, comment.desc)}
              >
                Update
              </button>
            )}
          </li>
        ))}
      </ul>

      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isUpdating ? "Update your comment" : "Add a comment"}
          required
        ></textarea>
        <button type="submit">
          {isUpdating ? "Update Comment" : "Add Comment"}
        </button>
      </form>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default CommentModal;
