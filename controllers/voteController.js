const Votes = require("../models/voteModel");
const customError = require("../utils/customError");

//@desc add vote
//route PUT/api/votes
//access private

const addVote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { argumentId, debateId } = req.body;
    if (!argumentId || !debateId) {
      throw customError(400, "Argument id and debate id is required");
    }

    await Votes.create({ userId, argumentId, debateId });
    res.status(200).send({ message: "Voted" });
  } catch (error) {
    next(error);
  }
};

//@desc remove vote
//route DELETE/api/votes
//access private
const deleteVote = async (req, res, next) => {
  try {
    const voteId = req.params.id;
    const userId = req.user?._id;

    await Votes.deleteOne({ _id: voteId, userId });
    res.status(200).send({ message: "Vote removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addVote, deleteVote };
