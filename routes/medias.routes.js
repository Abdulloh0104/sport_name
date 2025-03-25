const {
  addNewMedia,
  getAllMedias,
  getMediaById,
  updateMediaById,
  deleteMedia,
} = require("../controllers/medias.controller");

const router = require("express").Router();

router.post("/", addNewMedia);
router.get("/", getAllMedias);
router.get("/:id", getMediaById);
router.put("/:id", updateMediaById);
router.delete("/:id", deleteMedia);

module.exports = router;
