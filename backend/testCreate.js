const mongoose = require("mongoose");
const Repository = require("./models/repoModel");
const Contribution = require("./models/contributionModel");
const User = require("./models/userModel");
require("dotenv").config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const owner = "65f4c541b5161d7b1a201c10";

  try {
    const newRepository = new Repository({ 
      name: "TestRepo_" + Date.now(), 
      description: "Test", 
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
          reviews: []
        }
      ] 
    });
    const result = await newRepository.save();
    console.log("Saved repository:", result._id);

    await Contribution.create({
      user: owner,
      type: "repo",
      date: new Date()
    });
    console.log("Saved contribution.");

  } catch (err) {
    console.error("Error during DB operations:", err);
  }

  process.exit(0);
}

test();
