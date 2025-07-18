const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: [true, "User id is required"],
  },
  argumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Argument",
    require: [true, "Argument id is required"],
  },
  debateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Debate",
    require: [true, "Debate id is required"],
  },
});

const Vote = mongoose.models?.Vote || mongoose.model("Vote", voteSchema);

module.exports = Vote;
