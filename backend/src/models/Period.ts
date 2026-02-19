import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  flow: {
    type: String,
    enum: ["spotting", "light", "medium", "heavy"],
    required: true,
  },
  symptoms: [String],
});

const periodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    days: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Period", periodSchema);
