const Votes = require("../models/voteModel");
const customError = require("../utils/customError");

//@desc get scoreboard
//route POST/api/votes/scoreboard
//access public
const getScoreBoard = async (req, res, next) => {
  try {
    const { filter } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (filter === "weekly") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      dateFilter = { createdAt: { $gte: oneWeekAgo } };
    } else if (filter === "monthly") {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      dateFilter = { createdAt: { $gte: oneMonthAgo } };
    }

    const scoreboard = await Votes.aggregate([
      { $match: filter ? dateFilter : {} },

      {
        $group: {
          _id: "$argumentId",
          voteCount: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "arguments",
          localField: "_id",
          foreignField: "_id",
          as: "argument",
        },
      },
      { $unwind: "$argument" },

      {
        $group: {
          _id: "$argument.userId",
          totalVotes: { $sum: "$voteCount" },
          debateIds: { $addToSet: "$argument.debateId" },
        },
      },

      {
        $addFields: {
          totalDebates: { $size: "$debateIds" },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          totalVotes: 1,
          totalDebates: 1,
        },
      },

      {
        $sort: { totalVotes: -1 },
      },
    ]);

    res.status(200).json(scoreboard);
  } catch (error) {
    next(error);
  }
};

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
    const alreadyVoted = await Votes.findOne({ argumentId, userId });
    if (alreadyVoted) {
      throw customError(400, "Already voted");
    }
    await Votes.create({ userId, argumentId, debateId });
    res.status(200).send({ message: "Voted" });
  } catch (error) {
    next(error);
  }
};

//@desc remove vote
//route DELETE/api/votes/:argumentId
//access private
const deleteVote = async (req, res, next) => {
  try {
    const argumentId = req.params.argumentId;
    const userId = req.user?._id;

    await Votes.deleteOne({ argumentId, userId });
    res.status(200).send({ message: "Vote removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addVote, deleteVote, getScoreBoard };
