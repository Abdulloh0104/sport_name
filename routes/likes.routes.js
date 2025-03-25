const {
  addNewLike,
  getAllLikes,
  getLikeById,
  updateLikeById,
  deleteLike,
} = require("../controllers/likes.controller");

const router = require("express").Router();

router.post("/", addNewLike);
router.get("/", getAllLikes);
router.get("/:id", getLikeById);
router.put("/:id", updateLikeById);
router.delete("/:id", deleteLike);

module.exports = router;
