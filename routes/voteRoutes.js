const express = require("express");
const { addVote, deleteVote } = require("../controllers/voteController");
const router = express.Router();

router.post("/", addVote);
router.delete("/:id", deleteVote);
module.exports = router;
