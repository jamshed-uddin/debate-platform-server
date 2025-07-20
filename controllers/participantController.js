const Participants = require("../models/participantModel");
const Debates = require("../models/debateModel");
const customError = require("../utils/customError");
const { isTimeExpired } = require("../utils/timeUtilities");

//@desc add participant
//route POST/api/participants
//access private

const addParticipant = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const { debateId, side } = req.body;

    const debate = await Debates.findById(debateId);
    if (!debate) {
      throw customError(404, "Debate not found");
    }

    if (isTimeExpired(debate?.createdAt, debate?.duration)) {
      throw customError(400, "Debate has ended");
    }

    const alreadyParticipated = await Participants.findOne({
      debateId: debateId,
      userId: userId,
    });

    if (alreadyParticipated) {
      return res.status(200).send({ message: "Already participated" });
    }

    await Participants.create({ userId, debateId, side });

    res.status(200).send({ message: "Participant added" });
  } catch (error) {
    next(error);
  }
};

//@desc get participants
//route GET/api/participants
//access public
const getParticipants = async (req, res, next) => {
  try {
    const debateId = req.query.debateId;

    if (!debateId) {
      throw customError(400, "Debate id is required");
    }

    const participants = await Participants.find({ debateId }).populate(
      "userId",
      "-password"
    );

    res.status(200).send(participants);
  } catch (error) {
    next(error);
  }
};

//@desc remove/delete participants (leave debate)
//route DELETE/api/participants/:debateId
//access public
const deleteParticipants = async (req, res, next) => {
  try {
    const debateId = req.params.debateId;
    const userId = req.user?._id;

    await Participants.deleteOne({ debateId, userId });

    res.status(200).send({ message: "Left debate" });
  } catch (error) {
    next(RangeError);
  }
};

module.exports = { addParticipant, getParticipants, deleteParticipants };
