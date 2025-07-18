const express = require("express");
const {
  getArguments,
  createArgument,
  editArgument,
  deleteArgument,
} = require("../controllers/argumentController");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(getArguments).post(verifyAuth, createArgument);
router
  .route("/:id")
  .put(verifyAuth, editArgument)
  .delete(verifyAuth, deleteArgument);

module.exports = router;
