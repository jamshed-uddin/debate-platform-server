const express = require("express");
const {
  createDebate,
  getDebates,
  updateDebate,
  getDebate,
  deleteDebate,
} = require("../controllers/debateController");
const router = express.Router();

router.route("/").post(createDebate).get(getDebates);
router.get("/:id", getDebate);
router.route("/:id").put(updateDebate).delete(deleteDebate);

module.exports = router;
