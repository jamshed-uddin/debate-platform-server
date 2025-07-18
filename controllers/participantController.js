const Participants = require("../models/participantModel");
const Debates = require("../models/debateModel");
const customError = require("../utils/customError");

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

    const participants = await Participants.find({ debateId });

    res.status(200).send(participants);
  } catch (error) {
    next(error);
  }
};

//@desc remove/delete participants (leave debate)
//route GET/api/participants
//access public

const deleteParticipants = async (req, res, next) => {
  try {
    const participantId = req.params.id;
    const userId = req.user?._id;

    await Participants.deleteOne({ _id: participantId, userId });

    res.status(200).send({ message: "Left debate" });
  } catch (error) {
    next(RangeError);
  }
};

module.exports = { addParticipant, getParticipants, deleteParticipants };
