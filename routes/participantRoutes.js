const express = require("express");
const {
  getParticipants,
  addParticipant,
  deleteParticipants,
} = require("../controllers/participantController");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getParticipants); //params - debateId
router.post("/", verifyAuth, addParticipant);
router.delete("/:id", verifyAuth, deleteParticipants); //id here is id of participant entry in db not user id

module.exports = router;
