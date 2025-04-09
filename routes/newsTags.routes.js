const {
  addNewNewsTag,
  getAllNewsTags,
  getNewsTagById,
  updateNewsTagById,
  deleteNewsTag,
} = require("../controllers/newsTags.controller");

const router = require("express").Router();

router.post("/", addNewNewsTag);
router.get("/", getAllNewsTags);
router.get("/:id", getNewsTagById);
router.put("/:id", updateNewsTagById);
router.delete("/:id", deleteNewsTag);

module.exports = router;
