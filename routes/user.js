const express = require("express");
const {
  handleGetAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createNewUser,
} = require("../controllers/user");

const router = express.Router();

// REST API
router.route("/").get(handleGetAllUsers).post(createNewUser);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
