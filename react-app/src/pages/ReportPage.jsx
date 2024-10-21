import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReportsThunk,
  createReportThunk,
  addCommentThunk,
  updateCommentThunk,
} from "../store/reportSlice/report.thunk";
import { selectReports } from "../store/reportSlice/report.selectors";
import CommentModal from "../components/CommentModal";
import ReportPagination from "../components/ReportPagination";
import SortReport from "../components/SortReport";

const ReportPage = () => {
  const dispatch = useDispatch();
  const reports = useSelector(selectReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [commentIdToUpdate, setCommentIdToUpdate] = useState(null);
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportDesc, setNewReportDesc] = useState("");
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
    currentPage * reportsPerPage
  );

  // Handler for set new page status
  const handlePageChange = (newPage) => {
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
      // Make sure the newly added comment is showing right after it's been added
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
      // Make sure the newly updated comment is showing right after it's been updated
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

  // Handler for creating a new report
  const handleCreateReport = (e) => {
    e.preventDefault();
    const newReport = {
      title: newReportTitle,
      desc: newReportDesc,
    };
    dispatch(createReportThunk(newReport));
    setNewReportTitle("");
    setNewReportDesc("");
  };

  return (
    <div>
      <h2>Facility Reports</h2>
      <h3>Create a New Report</h3>
      <form onSubmit={handleCreateReport}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={newReportTitle}
            onChange={(e) => setNewReportTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea
            value={newReportDesc}
            onChange={(e) => setNewReportDesc(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      <SortReport sortOption={sortOption} setSortOption={setSortOption} />
      <ul>
        {currentReports.map((report) => (
          <li key={report._id}>
            <h4>{report.title}</h4>
            <p>{report.desc}</p>
            <button onClick={() => openCommentModal(report)}>
              View Comments
            </button>
          </li>
        ))}
      </ul>

      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedReport && (
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
      )}
    </div>
  );
};

export default ReportPage;
