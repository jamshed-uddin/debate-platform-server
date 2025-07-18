const Arguments = require("../models/argumentModel");
const customError = require("../utils/customError");

//@desc create argument
//route POST/api/arguments
//access private
const createArgument = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { debateId, content } = req.body;
    if (!debateId || !content) {
      throw customError(400, "Debate id and argument content is required");
    }

    await Arguments.create({ userId, debateId, content });

    res.status(200).send({ message: "Argument posted" });
  } catch (error) {
    next(error);
  }
};

//@desc get arguments
//route GET/api/arguments
//access public

const getArguments = async (req, res, next) => {
  try {
    const { debateId, sortBy } = req.query;

    const stages = [
      // getting arguments of debate
      {
        $match: {
          debateId,
        },
      },
      //   getting votes of each argument
      {
        $lookup: {
          from: "votes",
          localField: "$_id",
          foreignField: "$argumentId",
          as: "votes",
        },
      },
      // getting userinfo of argument creator. getting it from participants because we can get side field
      {
        $lookup: {
          from: "participants",
          localField: "userId",
          foreignField: "$userId",
          as: "user",
        },
      },
      //   flattening the user which was an array
      { $unwind: "$user" },

      //  overriding the votes field and mapping thru each vote and only adding voter's id to the array. helpful in UI to determine user voted or not
      {
        $addFields: {
          votes: {
            $map: {
              input: "$votes",
              as: "vote",
              in: "$$vote.userId",
            },
          },
          //   getting count of vote in each argument. helps sorting by vote count
          voteCount: { $size: "$votes" },
        },
      },
    ];

    // adding sort stages according to user's query
    if (sortBy) {
      if (sortBy === "date") {
        stages.push({
          $sort: {
            createdAt: -1,
          },
        });
      }
      if (sortBy === "votes") {
        stages.push({
          $sort: {
            voteCount: -1,
          },
        });
      }
    }

    const arguments = await Arguments.aggregate(stages);

    res.status(200).send(arguments);
  } catch (error) {
    next(error);
  }
};

const isEditDeleteTimeEnded = (createdAt) => {
  const now = Date.now();
  const createdAtMili = new Date(createdAt).getTime();
  const fiveMinToMili = 5 * 60 * 1000;

  return createdAtMili + fiveMinToMili < now;
};

//@desc edit argument
//route PUT/api/arguments/:id
//access private

const editArgument = async (req, res, next) => {
  try {
    const argumentId = req.params.id;
    const userId = req.user?._id;

    const { content } = req.body;
    if (!content) {
      throw customError(400, "Content is required");
    }
    const argument = await Arguments.findOne({
      _id: argumentId,
      userId: userId,
    });

    if (isEditDeleteTimeEnded(argument?.createdAt)) {
      throw customError(400, "Edit time ended");
    }

    argument.content = content;
    await argument.save();

    res.status(200).send({ messge: "Argument updated" });
  } catch (error) {
    next(error);
  }
};

//@desc delete argument
//route PUT/api/arguments/:id
//access private

const deleteArgument = async (req, res, next) => {
  try {
    const argumentId = req.params.id;
    const userId = req.user?._id;

    const argument = await Arguments.findOne({
      _id: argumentId,
      userId: userId,
    });

    if (isEditDeleteTimeEnded(argument?.createdAt)) {
      throw customError(400, "Edit time ended");
    }

    await Arguments.findByIdAndDelete(argumentId);
    res.status(200).send({ messge: "Argument deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createArgument, getArguments, editArgument, deleteArgument };
