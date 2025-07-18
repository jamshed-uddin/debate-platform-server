const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
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
    side: {
      type: String,
      enum: ["Support", "Oppose"],
      required: [true, "Side is required"],
    },
  },
  { timestamps: true }
);

const Participant =
  mongoose.models?.Participant ||
  mongoose.model("Participant", participantSchema);

module.exports = Participant;
