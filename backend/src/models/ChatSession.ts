import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    analysis?: {
      emotionalState?: string;
      themes?: string[];
      riskLevel?: number;
      recommendedApproach?: string;
    };
    currentGoal?: string | null;
    progress?: {
      emotionalState?: string;
      riskLevel?: number;
    };
  };
}

export interface IChatSession extends Document {
  _id: Types.ObjectId;
  sessionId: string;
  userId: Types.ObjectId;
  startTime: Date;
  status: "active" | "completed" | "archived";
  messages: IChatMessage[];
}

const chatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    analysis: Schema.Types.Mixed,
    currentGoal: String,
    progress: {
      emotionalState: String,
      riskLevel: Number,
    },
  },
});

const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    messages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);


export const ChatSession =
  mongoose.models.ChatSession ||
  model<IChatSession>("ChatSession", chatSessionSchema);
