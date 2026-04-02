const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const supabase = require('../config/Supabase');
const Contribution = require("../models/contributionModel");

// ----- Add OpenAI integration -----
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SUPABASE_BUCKET_NAME = 'VCTRL';

// Generate a signed URL for viewing a file in Supabase
async function getSignedUrl(storagePath) {
  const { data, error } = await supabase
    .storage
    .from(SUPABASE_BUCKET_NAME)
    .createSignedUrl(storagePath, 3600); // 1 hour expiry
  if (error) throw error;
  return data.signedUrl;
}

// Generate a signed URL for downloading a file in Supabase (forces download)
async function getDownloadUrl(storagePath, filename) {
  const { data, error } = await supabase
    .storage
    .from(SUPABASE_BUCKET_NAME)
    .createSignedUrl(storagePath, 3600, { download: filename });
  if (error) throw error;
  
  return data.signedUrl;
}

// Utility to get AI review for file
async function generateAIReview(fileContent, filename) {
  try {
    const aiResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a code reviewer. Review the contents of the file "${filename}". Give succinct feedback (2-3 sentences) about quality, clarity, and potential improvements.`
        },
        { role: "user", content: fileContent }
      ],
    });

    return {
      reviewerType: 'AI',
      reviewer: null,
      comments: aiResp.choices[0].message.content,
      fileReviewed: filename,
      status: "AI Reviewed",
      createdAt: new Date(),
    };
  } catch (err) {
    console.error("AI review generation failed:", err);
    return {
      reviewerType: 'AI',
      reviewer: null,
      comments: "AI review could not be generated for this file.",
      fileReviewed: filename,
      status: "Review Failed",
      createdAt: new Date(),
    };
  }
}

async function createRepository(req, res) {
  try {
    const { name, description, visibility, owner } = req.body;
    const files = req.files;

    if (!name) return res.status(400).json({ error: "Repository name is required!" });
    if (!files || files.length === 0) return res.status(400).json({ error: "At least one file is required!" });

    const filePromises = files.map(async (file) => {
      const storagePath = `repo-temp/${Date.now()}-${file.originalname}`;
      const { error } = await supabase.storage
        .from("VCTRL")
        .upload(storagePath, file.buffer, { contentType: file.mimetype });
      if (error) throw error;

      const signedUrl = await getSignedUrl(storagePath);
      const downloadUrl = await getDownloadUrl(storagePath, file.originalname);
      const fileContent = file.buffer.toString("utf-8");
      const aiReview = await generateAIReview(fileContent, file.originalname);

      return {
        filename: file.originalname,
        storagePath,
        signedUrl,
        downloadUrl,
        mimetype: file.mimetype,
        size: file.size,
        reviews: [aiReview],
      };
    });

    const content = await Promise.all(filePromises);

    const newRepository = new Repository({ name, description, visibility, owner, content });
    const result = await newRepository.save();

    // Save contribution for this repo creation
    await Contribution.create({
      user: owner, // should be MongoDB ObjectId of user
      type: "repo",
      date: new Date()
    });

    res.status(201).json({
      message: "Repository created successfully!",
      repositoryID: result._id.toString(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A repository with this name already exists." });
    }
    console.error("Error during repository creation:", err);
    res.status(500).json({ error: "Server error during repository creation." });
  }
}

// Fetch user contributions
// In your backend/controllers/repoController.js

async function getUserContributions(req, res) {
  try {
    const { userID } = req.params;
    const mongoose = require("mongoose"); // Ensure mongoose is available

    const contributions = await Contribution.aggregate([
      // ✅ CORRECT: Add the "new" keyword here
      { $match: { user: new mongoose.Types.ObjectId(userID) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for Nivo Calendar: { day: 'YYYY-MM-DD', value: N }
    const formatted = contributions.map(c => ({
      day: `${c._id.year}-${String(c._id.month).padStart(2, '0')}-${String(c._id.day).padStart(2, '0')}`,
      value: c.count
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching contributions:", err);
    res.status(500).json({ error: "Failed to fetch contributions" });
  }
}




// Manual add AI review (can be used to add reviews manually or batch)
async function addAIReview(req, res) {
  try {
    const { id } = req.params;
    const { reviews } = req.body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ error: 'Reviews array is required.' });
    }

    const formattedReviews = reviews.map(r => ({
      reviewerType: 'AI',
      reviewer: null,
      ...r,
      createdAt: new Date(),
    }));

    // Attach to repository-wide reviews (not per file; mostly for manual or global reviews)
    const updatedRepo = await Repository.findByIdAndUpdate(
      id,
      { $push: { reviews: { $each: formattedReviews } } },
      { new: true }
    );

    if (!updatedRepo) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    res.json({ message: 'AI reviews saved successfully' });
  } catch (err) {
    console.error('Error saving AI reviews:', err);
    res.status(500).json({ error: 'Server error while saving reviews.' });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner", "username email")
      .populate("issues")
      .select("+content")
      .lean();

    const reposWithFiles = repositories.map(repo => ({
      ...repo,
      files: repo.content.map(file => ({ name: file.filename }))
    }));

    res.json(reposWithFiles);
  } catch (err) {
    console.error("Error fetching repositories: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function fetchRepositoryById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid repository ID" });
    }

    const repo = await Repository.findById(id)
      .populate("owner", "username email")
      .populate("issues")
      .select("+content +reviews")
      .lean();

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    // Attach signed URLs (view & download) per file
    const contentWithDetails = await Promise.all(
      repo.content.map(async (file) => ({
        ...file,
        signedUrl: await getSignedUrl(file.storagePath),    // for view
        downloadUrl: await getDownloadUrl(file.storagePath, file.filename),  // for download
        // reviews already attached in file.reviews
      }))
    );

    res.json({
      ...repo,
      content: contentWithDetails,
      files: repo.content.map(file => ({ name: file.filename })),
    });
  } catch (err) {
    console.error("Error fetching repository by ID: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function fetchRepositoryByName(req, res) {
  try {
    const { name } = req.params;
    const repository = await Repository.findOne({ name })
      .populate("owner", "username email")
      .populate("issues")
      .lean();

    if (!repository) return res.status(404).json({ error: "Repository not found" });

    res.json(repository);
  } catch (err) {
    console.error("Error fetching repository by name: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  try {
    const { userID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const repositories = await Repository.find({ owner: userID })
      .populate("issues")
      .lean();

    res.json({ repositories });
  } catch (err) {
    console.error("Error fetching user repositories: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateRepositoryById(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRepository = await Repository.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRepository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository updated successfully!", repository: updatedRepository });
  } catch (err) {
    console.error("Error updating repository: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteRepositoryById(req, res) {
  try {
    const { id } = req.params;
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const filesToDelete = repository.content.map(file => file.storagePath);
    if (filesToDelete.length > 0) {
      await supabase.storage.from(SUPABASE_BUCKET_NAME).remove(filesToDelete);
    }

    await Repository.findByIdAndDelete(id);

    res.json({ message: "Repository and associated files deleted successfully!" });
  } catch (err) {
    console.error("Error deleting repository: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  addAIReview,
  getUserContributions
};
