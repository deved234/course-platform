const asyncHandler = require("../../utils/asyncHandler");
const dashboardService = require("./dashboard.service");

const getInstructorDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getInstructorDashboard(req.user._id);

  res.status(200).json({
    success: true,
    message: "Instructor dashboard fetched successfully",
    data,
  });
});

module.exports = {
  getInstructorDashboard,
};
