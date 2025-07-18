const express = require("express");
const { addVote, deleteVote } = require("../controllers/voteController");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(verifyAuth);
router.post("/", addVote);
router.delete("/:id", deleteVote);
module.exports = router;
