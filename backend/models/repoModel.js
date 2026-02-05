const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define review schema
const ReviewSchema = new Schema({
  reviewerType: { type: String, enum: ['human', 'AI'], default: 'AI' },
  // reviewer for human, null for AI
  reviewer: { type: Schema.Types.ObjectId, ref: "User" },
  comments: { type: String, required: true },
  status: { type: String, enum: ["approved", "changes_requested", "commented", "AI Reviewed", "Review Failed"], default: "AI Reviewed" },
  createdAt: { type: Date, default: Date.now }
});

// Attach review schema inside each file in content
const FileSchema = new Schema({
  filename: { type: String, required: true },
  storagePath: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
  signedUrl: { type: String }, // Optionally store signed URL
  reviews: [ReviewSchema] // <-- Attach reviews array to file!
});

const RepositorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    content: [FileSchema], // content array contains file objects, each with reviews
    visibility: { type: Boolean },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    issues: [{ type: Schema.Types.ObjectId, ref: "Issue" }],
    // Optionally, keep a top-level reviews array for repo-wide reviews if needed
    reviews: [ReviewSchema] // (Optional, mostly for manual reviews spanning the whole repo)
  },
  { timestamps: true }
);

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;
