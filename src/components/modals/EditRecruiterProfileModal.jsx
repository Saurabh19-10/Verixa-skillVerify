import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function EditRecruiterProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    companyWebsite: "",
    linkedin: "",
    bio: "",
    hiringFocus: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        company: profile.company || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        companyWebsite: profile.companyWebsite || "",
        linkedin: profile.linkedin || "",
        bio: profile.bio || "",
        hiringFocus: Array.isArray(profile.hiringFocus)
          ? profile.hiringFocus.join(", ")
          : profile.hiringFocus || "",
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
      hiringFocus: formData.hiringFocus
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    onSave(updatedProfile);
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border border-slate-200 dark:border-slate-800
          bg-slate-50 dark:bg-slate-950
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Recruiter Profile
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg p-2
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-900 dark:hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />

            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Technical Recruiter"
            />

            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc."
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bengaluru, India"
            />

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com"
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />

            <Input
              label="Company Website"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://company.com"
            />

            <Input
              label="LinkedIn URL"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <Input
            label="Hiring Focus (comma separated)"
            name="hiringFocus"
            value={formData.hiringFocus}
            onChange={handleChange}
            placeholder="React, Node.js, DevOps, Full Stack"
          />

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bio
            </label>

            <textarea
              name="bio"
              rows={5}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell developers about yourself and what you're hiring for..."
              className="
                w-full rounded-xl
                border border-slate-300 dark:border-slate-700
                bg-white dark:bg-slate-900
                px-4 py-3
                text-slate-900 dark:text-white
                outline-none
                transition

                placeholder:text-slate-500
                focus:border-blue-500
              "
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
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
