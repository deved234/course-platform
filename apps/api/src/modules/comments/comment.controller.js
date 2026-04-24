const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("./comment.service");

const getComment = asyncHandler(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);

  res.status(200).json({
    success: true,
    message: "Comment fetched successfully",
    data: comment,
  });
});

const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.lessonId,
    req.user._id,
    req.body.content
  );

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: comment,
  });
});

const listCommentsByLesson = asyncHandler(async (req, res) => {
  const data = await commentService.listCommentsByLesson(req.params.lessonId, req.query);

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    data,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.commentId,
    req.user,
    req.body.content
  );

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: comment,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.commentId, req.user);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

module.exports = {
  getComment,
  createComment,
  listCommentsByLesson,
  updateComment,
  deleteComment,
};
