import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    text: { type: String, required: true },

    aiInsights: {
      insight: { type: String, default: "" },
    },

    analyzed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", JournalSchema);