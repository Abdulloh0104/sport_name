const {
  addNewNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotification,
} = require("../controllers/notifications.controller");

const router = require("express").Router();

router.post("/", addNewNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotificationById);
router.delete("/:id", deleteNotification);

module.exports = router;
