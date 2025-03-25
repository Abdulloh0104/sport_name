const {
  addNewNewsWithLang,
  getAllNewsWithLangs,
  getNewsWithLangById,
  updateNewsWithLangById,
  deleteNewsWithLang,
} = require("../controllers/newsWithLangs.controller");

const router = require("express").Router();

router.post("/", addNewNewsWithLang);
router.get("/", getAllNewsWithLangs);
router.get("/:id", getNewsWithLangById);
router.put("/:id", updateNewsWithLangById);
router.delete("/:id", deleteNewsWithLang);

module.exports = router;
