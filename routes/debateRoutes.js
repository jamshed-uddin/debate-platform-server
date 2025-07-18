const express = require("express");
const {
  createDebate,
  getDebates,
  updateDebate,
  getDebate,
  deleteDebate,
} = require("../controllers/debateController");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(verifyAuth, createDebate).get(getDebates);
router.get("/:id", getDebate);
router
  .route("/:id")
  .put(verifyAuth, updateDebate)
  .delete(verifyAuth, deleteDebate);

module.exports = router;
