const {
  addNewTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTag,
} = require("../controllers/tags.controller");

const router = require("express").Router();

router.post("/", addNewTag);
router.get("/", getAllTags);
router.get("/:id", getTagById);
router.put("/:id", updateTagById);
router.delete("/:id", deleteTag);

module.exports = router;
