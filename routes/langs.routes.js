const {
  addNewLang,
  getAllLangs,
  getLangById,
  updateLangById,
  deleteLangById,
} = require("../controllers/langs.controller");

const router = require("express").Router();

router.post("/", addNewLang);
router.get("/", getAllLangs);
router.get("/:id", getLangById);
router.put("/:id", updateLangById);
router.delete("/:id", deleteLangById);

module.exports = router;
