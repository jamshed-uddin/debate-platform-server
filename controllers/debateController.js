const Debates = require("../models/debateModel");
const Arguments = require("../models/argumentModel");
const Participants = require("../models/participantModel");
const Votes = require("../models/voteModel");
const customError = require("../utils/customError");
const { validateDebateInfo } = require("../utils/validate");
const mongoose = require("mongoose");
const { isTimeExpired } = require("../utils/timeUtilities");

//@desc create debate
//route POST/api/debates
//access private
const createDebate = async (req, res, next) => {
  const userId = req.user?._id;
  const { error, value } = validateDebateInfo(req.body);
  if (error) {
    throw customError(400, error.message);
  }

  const createdDebate = await Debates.create({ ...value, userId });
  console.log(createdDebate);
  res.status(200).send({ message: "Debate created", _id: createdDebate?._id });
  try {
  } catch (error) {
    next(error);
  }
};

//@desc get debates
//route GET/api/debates
//access public

const getDebates = async (req, res, next) => {
  try {
    const { status, category, userId, search } = req.query;
    if (
      (status && typeof status !== "string") ||
      (category && typeof category !== "string")
    ) {
      throw customError(400, "Invalid query param type");
    }

    const filter = {};

    if (status) {
      const now = new Date();
      if (status === "ended") {
        filter.$expr = {
          $lt: [{ $add: ["$createdAt", "$duration"] }, now],
        };
      }
      if (status === "ongoing") {
        filter.$expr = {
          $gt: [{ $add: ["$createdAt", "$duration"] }, now],
        };
      }
    }
    if (category) {
      filter.category = category;
    }
    if (userId) {
      filter.userId = userId;
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const debates = await Debates.find(filter);
    res.status(200).send(debates);
  } catch (error) {
    next(error);
  }
};

//@desc get a debate
//route GET/api/debates/:id
//access public

const getDebate = async (req, res, next) => {
  try {
    const debateId = req.params.id;

    const debate = await Debates.findById(debateId).lean();
    const participants = await Participants.find({
      debateId: debate._id,
    });

    if (!debate) {
      throw customError(404, "Debate not found");
    }

    const response = { ...debate, participants };

    if (isTimeExpired(debate?.createdAt, debate?.duration)) {
      const winnerAggr = await Arguments.aggregate([
        {
          $match: { debateId: new mongoose.Types.ObjectId(debate._id) },
        },
        {
          $lookup: {
            from: "votes",
            localField: "_id",
            foreignField: "argumentId",
            as: "votes",
          },
        },
        {
          $project: {
            side: 1,
            voteCount: { $size: "$votes" },
          },
        },
        {
          $group: {
            _id: "$side",
            totalVotes: {
              $sum: "$voteCount",
            },
          },
        },
        {
          $sort: {
            totalVotes: -1,
          },
        },
      ]);

      if (winnerAggr.length === 0) {
        response.winnerStatus = "Draw";
      } else if (winnerAggr.length === 1 && winnerAggr[0]?.totalVotes > 0) {
        response.winnerStatus = winnerAggr[0]._id;
      } else if (winnerAggr[0]?.totalVotes === winnerAggr[1]?.totalVotes) {
        response.winnerStatus = "Draw";
      } else {
        response.winnerStatus = winnerAggr[0]._id;
      }
    }

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

//@desc update a debate
//route PUT/api/debates/:id
//access private
const updateDebate = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const debateId = req.params.id;
    console.log(req.body);
    console.log(userId.toString());
    const { description, duration } = req.body;
    const debate = await Debates.findById(debateId);
    if (!debate) {
      throw customError(404, "Debate not found");
    }

    if (debate?.userId.toString() !== userId?.toString()) {
      throw customError(400, "Unauthorized action");
    }

    debate.description = description;
    debate.duration = duration;
    await debate.save();

    res.status(200).send({
      message: "Debate updated",
      _id: debate?._id,
    });
  } catch (error) {
    next(error);
  }
};

//@desc delete a debate
//route DELETE/api/debates/:id
//access private
const deleteDebate = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user?._id;
    const debateId = req.params.id;
    const debate = await Debates.findById(debateId).session(session);
    if (!debate) {
      throw customError(404, "Debate not found");
    }

    if (debate?.userId.toString() !== userId?.toString()) {
      throw customError(400, "Unauthorized action");
    }

    // delete arguments associated with the debate
    await Arguments.deleteMany({ debateId }).session(session);
    // delete participants associated with the debate
    await Participants.deleteMany({ debateId }).session(session);
    // delete votes associated with the debate
    await Votes.deleteMany({ debateId }).session(session);

    // delete the debate itself
    await Debates.findByIdAndDelete(debateId).session(session);

    await session.commitTransaction();
    res.status(200).send({ message: "Debate deleted" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createDebate,
  getDebates,
  getDebate,
  updateDebate,
  deleteDebate,
};
