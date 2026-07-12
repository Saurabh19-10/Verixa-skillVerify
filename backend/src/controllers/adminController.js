import User from "../models/User.js";
import Project from "../models/Project.js";
import AssessmentResult from "../models/AssessmentResult.js";
import AIReview from "../models/AIReview.js";

// Dashboard Analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const developers = await User.countDocuments({
      role: "developer",
    });

    const recruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalProjects = await Project.countDocuments();

    const verifiedProjects = await Project.countDocuments({
      status: "Verified",
    });

    const totalAssessments = 0;
    const totalResults = await AssessmentResult.countDocuments();

    const totalAIReviews = await AIReview.countDocuments();

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        developers,
        recruiters,
        totalProjects,
        verifiedProjects,
        totalAssessments,
        totalResults,
        totalAIReviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// All Projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// All AI Reviews
export const getAllAIReviews = async (req, res) => {
  try {
    const reviews = await AIReview.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};