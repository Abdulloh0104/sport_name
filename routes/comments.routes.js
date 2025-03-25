const {
  addNewComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteComment,
} = require("../controllers/comments.controller");

const router = require("express").Router();

router.post("/", addNewComment);
router.get("/", getAllComments);
router.get("/:id", getCommentById);
router.put("/:id", updateCommentById);
router.delete("/:id", deleteComment);

module.exports = router;
