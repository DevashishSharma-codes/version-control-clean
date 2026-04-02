const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Signup
async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user document
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with token, userId, and username
    res.json({ token, userId: newUser._id, username: newUser.username });
  } catch (err) {
  console.error("Error during signup:", err);
    res.status(500).send("Server error");
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).send("Server error!");
  }
}

// Get all users (excluding passwords)
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, "-password");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).send("Internal Server Error");
  }
}

// Get user profile by ID (exclude password)
async function getUserProfile(req, res) {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const user = await User.findById(userId).populate("starRepos").select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return res.status(500).send("Internal Server Error");
  }
}

// Update user profile (email and/or password)
async function updateUserProfile(req, res) {
  const userId = req.params.id;
  const { email, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error during updating:", err.message);
    res.status(500).send("Server error!");
  }
}

// Delete user profile
async function deleteUserProfile(req, res) {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during deletion:", err.message);
    res.status(500).send("Server error!");
  }
}

// Toggle star repository
async function toggleStar(req, res) {
  const userId = req.params.id;
  const { repoId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(repoId)) {
    return res.status(400).json({ message: "Invalid User or Repository ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isStarred = user.starRepos.includes(repoId);

    if (isStarred) {
      user.starRepos.pull(repoId);
    } else {
      user.starRepos.push(repoId);
    }

    await user.save();
    return res.json({ message: isStarred ? "Repository unstarred!" : "Repository starred!", starRepos: user.starRepos });
  } catch (err) {
    console.error("Error during toggling star:", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  toggleStar,
};
