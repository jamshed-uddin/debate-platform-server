const express = require("express");
const {
  addVote,
  deleteVote,
  getScoreBoard,
} = require("../controllers/voteController");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/scoreboard", getScoreBoard);
router.post("/", verifyAuth, addVote);
router.delete("/:argumentId", verifyAuth, deleteVote);

module.exports = router;
