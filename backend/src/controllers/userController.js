import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      github,
      linkedin,
      portfolio,
      avatar,
      skills,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (title !== undefined) user.title = title;
    if (bio !== undefined) user.bio = bio;
    if (github !== undefined) user.github = github;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (avatar !== undefined) user.avatar = avatar;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        title: updatedUser.title,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        github: updatedUser.github,
        portfolio: updatedUser.portfolio,
        avatar: updatedUser.avatar,
        trustScore: updatedUser.trustScore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    if (linkedin !== undefined) {
      user.linkedin = linkedin;
    }
  }
};