import mongoose from "mongoose";

const cyclePredictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    averageCycleLength: Number,
    nextExpectedDate: Date,
    confidence: Number,

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("CyclePrediction", cyclePredictionSchema);
