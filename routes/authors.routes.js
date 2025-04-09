const {
  addNewAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthor,
} = require("../controllers/authors.controller");

const router = require("express").Router();

router.post("/", addNewAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthorById);
router.delete("/:id", deleteAuthor);

module.exports = router;
