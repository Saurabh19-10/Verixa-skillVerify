import { useState } from "react";
import { X, Plus } from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";

export default function AddProjectModal({
  isOpen,
  onClose,
  onAddProject,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: "",
    live: "",
    tech: "",
    status: "Pending",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        github: formData.github,
        live: formData.live,
        status: formData.status,
        tech: formData.tech
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await onAddProject(projectData);

      setFormData({
        title: "",
        description: "",
        github: "",
        live: "",
        tech: "",
        status: "Pending",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Project
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <Input
            label="Project Name"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Verixa"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Project description..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <Input
            label="GitHub URL"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/username/project"
          />

          <Input
            label="Live Demo URL"
            name="live"
            value={formData.live}
            onChange={handleChange}
            placeholder="https://project.com"
          />

          <Input
            label="Tech Stack"
            name="tech"
            value={formData.tech}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              <Plus size={18} />
              {loading ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}