const {
  addNewUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
  activateUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} = require("../controllers/users.controller");

const router = require("express").Router();

router.post("/", addNewUser);
router.get("/", getAllUsers);
router.get("/activate/:link", activateUser);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshTokenUser);


module.exports = router;
