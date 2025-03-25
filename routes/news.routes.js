const {
  addNewNew,
  getAllNews,
  getNewById,
  updateNewById,
  deleteNew,
} = require("../controllers/news.controller");

const router = require("express").Router();

router.post("/", addNewNew);
router.get("/", getAllNews);
router.get("/:id", getNewById);
router.put("/:id", updateNewById);
router.delete("/:id", deleteNew);

module.exports = router;
