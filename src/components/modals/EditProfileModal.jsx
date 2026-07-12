import { useState, useEffect } from "react";
import { X, Save, Image } from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    avatar: "",
    github: "",
    linkedin: "",
    portfolio: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        email: profile.email || "",
        avatar: profile.avatar || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
        linkedin: profile.linkedin || "",
        bio: profile.bio || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
      });
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
            <img
              src={
                formData.avatar ||
                "https://i.pravatar.cc/200?img=12"
              }
              alt="Profile preview"
              className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover"
            />

            <div className="flex-1">
              <Input
                label="Profile Picture URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
              />

              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Image size={14} />
                Paste any image URL. Cloud upload can be added later.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
  <Input
    label="Full Name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter full name"
  />

  <Input
    label="Professional Title"
    name="title"
    value={formData.title}
    onChange={handleChange}
    placeholder="Full Stack Developer"
  />

  <Input
    label="Email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="example@gmail.com"
  />

  <Input
    label="GitHub URL"
    name="github"
    value={formData.github}
    onChange={handleChange}
    placeholder="https://github.com/username"
  />

  <Input
    label="LinkedIn URL"
    name="linkedin"
    value={formData.linkedin}
    onChange={handleChange}
    placeholder="https://www.linkedin.com/in/username"
  />

  <Input
    label="Portfolio URL"
    name="portfolio"
    value={formData.portfolio}
    onChange={handleChange}
    placeholder="https://portfolio.com"
  />

  <Input
    label="Skills"
    name="skills"
    value={formData.skills}
    onChange={handleChange}
    placeholder="React, Node.js, MongoDB"
  />
</div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bio
            </label>

            <textarea
              name="bio"
              rows={5}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell recruiters about yourself..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}