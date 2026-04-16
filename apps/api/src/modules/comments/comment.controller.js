const asyncHandler = require("../../utils/asyncHandler");
const commentService = require("./comment.service");

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

module.exports = {
  createComment,
  listCommentsByLesson,
};
