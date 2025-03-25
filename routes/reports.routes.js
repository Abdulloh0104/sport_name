const {
  addNewReport,
  getAllReports,
  getReportById,
  updateReportById,
  deleteReport,
} = require("../controllers/reports.controller");

const router = require("express").Router();

router.post("/", addNewReport);
router.get("/", getAllReports);
router.get("/:id", getReportById);
router.put("/:id", updateReportById);
router.delete("/:id", deleteReport);

module.exports = router;
