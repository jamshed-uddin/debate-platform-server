const mongoose = require("mongoose");

const debateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "User id is required"],
    },
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: [true, "Category is required"] },
    banner: { type: String, trim: true },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [3600000, "Duration must be at least 1 hour (in ms)"],
    },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Debate =
  mongoose.models?.Debate || mongoose.model("Debate", debateSchema);

module.exports = Debate;
