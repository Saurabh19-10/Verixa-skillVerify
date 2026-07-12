import User from "../models/User.js";
import Project from "../models/Project.js";
import AIReview from "../models/AIReview.js";

export const searchDevelopers = async (req, res) => {
  try {
    const { q, skill, minScore } = req.query;

    const query = {
      role: "developer",
    };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ];
    }

    if (skill) {
      query.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    if (minScore) {
      query.trustScore = {
        $gte: Number(minScore),
      };
    }

    const developers = await User.find(query)
      .select("-password")
      .sort({ trustScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: developers.length,
      developers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeveloperDetails = async (req, res) => {
  try {
    const developer = await User.findOne({
      _id: req.params.id,
      role: "developer",
    }).select("-password");

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    const projects = await Project.find({
      owner: developer._id,
    }).sort({ createdAt: -1 });

    const aiReview = await AIReview.findOne({
      user: developer._id,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      developer,
      projects,
      aiReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const recruiterDashboard = async (req, res) => {
  try {
    const totalDevelopers = await User.countDocuments({
      role: "developer",
    });

    const verifiedDevelopers = await User.countDocuments({
      role: "developer",
      trustScore: { $gte: 70 },
    });

    const totalProjects = await Project.countDocuments();

    const verifiedProjects = await Project.countDocuments({
      status: "Verified",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalDevelopers,
        verifiedDevelopers,
        totalProjects,
        verifiedProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const recruiterAnalytics = async (req, res) => {
    try {
      const totalDevelopers = await User.countDocuments({
        role: "developer",
      });
  
      const verifiedDevelopers = await User.countDocuments({
        role: "developer",
        trustScore: { $gte: 70 },
      });
  
      const growingDevelopers = await User.countDocuments({
        role: "developer",
        trustScore: { $lt: 70 },
      });
  
      const totalProjects = await Project.countDocuments();
  
      const verifiedProjects = await Project.countDocuments({
        status: "Verified",
      });
  
      const pendingProjects = await Project.countDocuments({
        status: "Pending",
      });
  
      const aiReviews = await AIReview.countDocuments();
  
      const topDevelopers = await User.find({
        role: "developer",
      })
        .select("-password")
        .sort({ trustScore: -1 })
        .limit(5);
  
      const recentDevelopers = await User.find({
        role: "developer",
      })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5);
  
      res.status(200).json({
        success: true,
        analytics: {
          overview: {
            totalDevelopers,
            verifiedDevelopers,
            growingDevelopers,
            totalProjects,
            verifiedProjects,
            pendingProjects,
            aiReviews,
          },
          topDevelopers,
          recentDevelopers,
          charts: {
            developerTrust: [
              {
                label: "Verified",
                value: verifiedDevelopers,
              },
              {
                label: "Growing",
                value: growingDevelopers,
              },
            ],
            projectStatus: [
              {
                label: "Verified",
                value: verifiedProjects,
              },
              {
                label: "Pending",
                value: pendingProjects,
              },
            ],
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };