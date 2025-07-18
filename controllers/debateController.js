const Debates = require("../models/debateModel");
const customError = require("../utils/customError");
const { validateDebateInfo } = require("../utils/validate");

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
    const { status, category } = req.query;
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
  } catch (error) {
    next(error);
  }
};

//@desc update a debate
//route PUT/api/debates/:id
//access private
const updateDebate = async (req, res, next) => {
  try {
  } catch (error) {
    next(customError);
  }
};

//@desc delete a debate
//route DELETE/api/debates/:id
//access private
const deleteDebate = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDebate,
  getDebates,
  getDebate,
  updateDebate,
  deleteDebate,
};
