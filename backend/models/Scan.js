import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUrl: String,
    securityScore: Number,
    critical: Number,
    high: Number,
    medium: Number,
    low: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);