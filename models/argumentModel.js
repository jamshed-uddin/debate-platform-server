const mongoose = require("mongoose");

const argumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "User id is required"],
    },
    debateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debate",
      require: [true, "Debate id is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Argument =
  mongoose.models?.Argument || mongoose.model("Argument", argumentSchema);

module.exports = Argument;
