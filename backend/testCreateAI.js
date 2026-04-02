const mongoose = require("mongoose");
const Repository = require("./models/repoModel");
require("dotenv").config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const owner = "65f4c541b5161d7b1a201c10";

  try {
    const newRepository = new Repository({ 
      name: "TestRepoAI_" + Date.now(), 
      description: "Test AI", 
      visibility: true, 
      owner, 
      content: [
        {
          filename: "test.js",
          storagePath: "repo-temp/123-test.js",
          mimetype: "application/javascript",
          size: 100,
          signedUrl: "http://example.com/test",
          downloadUrl: "http://example.com/test_dl",
          reviews: [{
            reviewerType: 'AI',
            reviewer: null,
            comments: "Looks good.",
            fileReviewed: "test.js",
            status: "AI Reviewed",
            createdAt: new Date(),
          }]
        }
      ] 
    });
    const result = await newRepository.save();
    console.log("Saved repository with AI review:", result._id);

  } catch (err) {
    console.error("Error during DB operations:", err);
  }

  process.exit(0);
}

test();
