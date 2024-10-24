import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReportsThunk,
  addCommentThunk,
  updateCommentThunk,
} from "../store/reportSlice/report.thunk";
import { selectReports } from "../store/reportSlice/report.selectors";
import CommentModal from "../components/CommentModal";
import SortReport from "../components/SortReport";
import {
  Typography,
  Button,
  Box,
  Pagination,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const ReportHistory = () => {
  const dispatch = useDispatch();
  const reports = useSelector(selectReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [commentIdToUpdate, setCommentIdToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("latest");
  const reportsPerPage = 5;

  useEffect(() => {
    dispatch(fetchReportsThunk());
  }, [dispatch]);

  // Sorting logic
  const sortedReports = [...reports].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.timestamp) - new Date(a.timestamp); // Sort by latest first
    }
    return new Date(a.timestamp) - new Date(b.timestamp); // Sort by oldest first
  });

  // Break reports in pages, limit certain number of reports in each page
  const totalReports = sortedReports.length;
  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const currentReports = sortedReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage,
  );

  // Handler for set new page status
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Set states when a modal is opened
  const openCommentModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    setIsUpdating(false);
    setCommentIdToUpdate(null);
  };

  // Set states when a modal is closed
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setIsUpdating(false);
    setCommentIdToUpdate(null);
  };

  // Function for adding a new comment on a report
  const addComment = (reportId, commentDesc) => {
    dispatch(addCommentThunk({ reportId, comment: commentDesc }))
      .unwrap()
      .then((updatedReport) => {
        setSelectedReport((prevReport) => ({
          ...prevReport,
          comments: updatedReport.report.comments,
        }));
      });
  };

  // Handle updating an existing comment
  const updateComment = (reportId, commentId, newCommentDesc) => {
    dispatch(updateCommentThunk({ reportId, commentId, desc: newCommentDesc }))
      .unwrap()
      .then((updatedReport) => {
        setSelectedReport((prevReport) => ({
          ...prevReport,
          comments: updatedReport.report.comments,
        }));
        setIsUpdating(false);
        setCommentIdToUpdate(null);
      });
  };

  // Trigger comment update
  const triggerUpdateComment = (commentId, commentDesc) => {
    setIsUpdating(true);
    setCommentIdToUpdate(commentId);
    // Prefill the form with the existing comment text to be updated
    setNewComment(commentDesc);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Facility Reports
      </Typography>

      {/* Sort Dropdown */}
      <SortReport sortOption={sortOption} setSortOption={setSortOption} />

      {/* Report List */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        {currentReports.map((report) => (
          <Card
            key={report._id}
            variant="outlined"
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              width: "400px",
            }}
          >
            <CardContent>
              <Typography variant="h6">{report.title}</Typography>
              <Typography>{report.desc}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => openCommentModal(report)}
              >
                View Comments
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Comment Modal */}
      {selectedReport && (
        <Box sx={{ overflowY: "auto" }}>
          <CommentModal
            isOpen={isModalOpen}
            onClose={closeModal}
            comments={selectedReport.comments}
            reportId={selectedReport._id}
            addComment={addComment}
            updateComment={updateComment}
            isUpdating={isUpdating}
            commentIdToUpdate={commentIdToUpdate}
            triggerUpdateComment={triggerUpdateComment}
            currentUserId={selectedReport.createdBy}
          />
        </Box>
      )}
    </Box>
  );
};

export default ReportHistory;
