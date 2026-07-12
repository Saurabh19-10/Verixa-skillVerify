import mongoose from "mongoose";

import Project from "../models/Project.js";

const normalizeText = (value = "") => {
  return value.toString().trim();
};

const normalizeTech = (tech) => {
  const values = Array.isArray(tech)
    ? tech
    : typeof tech === "string"
      ? tech.split(",")
      : [];

  return [
    ...new Set(
      values
        .map((item) => normalizeText(item))
        .filter(Boolean)
    ),
  ];
};

const normalizeOptionalUrl = (value = "") => {
  const url = normalizeText(value);

  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }

    return parsedUrl.toString();
  } catch {
    throw new Error("Please provide a valid HTTP or HTTPS URL");
  }
};

const isValidProjectId = (projectId) => {
  return mongoose.Types.ObjectId.isValid(projectId);
};

const resetVerification = (project) => {
  project.verificationScore = 0;
  project.verificationStatus = "Pending";

  project.verificationBreakdown = {
    githubRepository: 0,
    liveDemo: 0,
    readme: 0,
    description: 0,
    technologies: 0,
    recentActivity: 0,
    repositoryQuality: 0,
  };

  project.verificationMessage =
    "Project details changed. Please verify the project again.";

  project.githubAnalytics = null;
  project.verifiedAt = null;
  project.lastVerifiedAt = null;
};

// =========================================
// POST /api/projects
// =========================================

export const createProject = async (req, res) => {
  try {
    const title = normalizeText(req.body.title);
    const description = normalizeText(req.body.description);

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const github = normalizeOptionalUrl(req.body.github);
    const live = normalizeOptionalUrl(req.body.live);
    const image = normalizeOptionalUrl(req.body.image);

    const project = await Project.create({
      title,
      description,
      tech: normalizeTech(req.body.tech),
      github,
      live,
      image,
      owner: req.user._id,

      // Verification values are server-controlled.
      verificationScore: 0,
      verificationStatus: "Pending",
      verificationMessage:
        "Project has not been verified yet.",
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    const statusCode =
      error.message ===
      "Please provide a valid HTTP or HTTPS URL"
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// GET /api/projects
// =========================================

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// GET /api/projects/:id
// =========================================

export const getProjectById = async (req, res) => {
  try {
    if (!isValidProjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// PUT /api/projects/:id
// =========================================

export const updateProject = async (req, res) => {
  try {
    if (!isValidProjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let verificationRelevantFieldChanged = false;

    if (req.body.title !== undefined) {
      const title = normalizeText(req.body.title);

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Project title cannot be empty",
        });
      }

      if (title !== project.title) {
        project.title = title;
        verificationRelevantFieldChanged = true;
      }
    }

    if (req.body.description !== undefined) {
      const description = normalizeText(
        req.body.description
      );

      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Project description cannot be empty",
        });
      }

      if (description !== project.description) {
        project.description = description;
        verificationRelevantFieldChanged = true;
      }
    }

    if (req.body.tech !== undefined) {
      const tech = normalizeTech(req.body.tech);

      if (
        JSON.stringify(tech) !==
        JSON.stringify(project.tech || [])
      ) {
        project.tech = tech;
        verificationRelevantFieldChanged = true;
      }
    }

    if (req.body.github !== undefined) {
      const github = normalizeOptionalUrl(req.body.github);

      if (github !== project.github) {
        project.github = github;
        verificationRelevantFieldChanged = true;
      }
    }

    if (req.body.live !== undefined) {
      const live = normalizeOptionalUrl(req.body.live);

      if (live !== project.live) {
        project.live = live;
        verificationRelevantFieldChanged = true;
      }
    }

    if (req.body.image !== undefined) {
      project.image = normalizeOptionalUrl(req.body.image);
    }

    if (verificationRelevantFieldChanged) {
      resetVerification(project);
    }

    const updatedProject = await project.save();

    return res.status(200).json({
      success: true,
      message: verificationRelevantFieldChanged
        ? "Project updated. Verification has been reset."
        : "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    const statusCode =
      error.message ===
      "Please provide a valid HTTP or HTTPS URL"
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// DELETE /api/projects/:id
// =========================================

export const deleteProject = async (req, res) => {
  try {
    if (!isValidProjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};