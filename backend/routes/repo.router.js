const express = require("express");
const multer = require("multer");
const upload = multer(); // memory storage
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();

// Create repo with file uploads
repoRouter.post("/repo/create", upload.array("files"), repoController.createRepository);
repoRouter.get("/repo/contributions/:userID", repoController.getUserContributions);

// Get all repos
repoRouter.get("/repo/all", repoController.getAllRepositories);

// Get repo by ID (directly delegates to controller; controller attaches signed URLs and file reviews correctly)
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);

// Get repo by name
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);

// Get repos for user
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);

// Update repo
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);

// Delete repo
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);

// Add AI (or other) review to repo (manual/optional)
repoRouter.post("/repo/:id/reviews", repoController.addAIReview);

module.exports = repoRouter;
