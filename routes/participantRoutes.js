const express = require("express");
const {
  getParticipants,
  addParticipant,
  deleteParticipants,
} = require("../controllers/participantController");
const router = express.Router();

router.get("/", getParticipants); //params - debateId
router.post("/", addParticipant);
router.delete("/:id", deleteParticipants); //id here is id of participant entry in db not user id

module.exports = router;
