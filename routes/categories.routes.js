const {
  addNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategory,
} = require("../controllers/categories.controller");

const router = require("express").Router();

router.post("/", addNewCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategory);

module.exports = router;
