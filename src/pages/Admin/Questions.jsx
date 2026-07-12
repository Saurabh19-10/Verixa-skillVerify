import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Save,
  X,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import {
  getQuestions,
  getQuestionStats,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../api/questionApi";

const emptyForm = {
  skill: "",
  category: "",
  difficulty: "Easy",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  isActive: true,
};

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    skill: "",
    difficulty: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [questionData, statsData] = await Promise.all([
        getQuestions(filters),
        getQuestionStats(),
      ]);

      setQuestions(questionData || []);
      setStats(statsData);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = async () => {
    await fetchData();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setForm((prev) => {
      const options = [...prev.options];
      options[index] = value;

      return {
        ...prev,
        options,
      };
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const updated = await updateQuestion(editingId, form);

        setQuestions((prev) =>
          prev.map((q) => (q._id === editingId ? updated : q))
        );
      } else {
        const created = await createQuestion(form);
        setQuestions((prev) => [created, ...prev]);
      }

      resetForm();
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save question");
    }
  };

  const handleEdit = (question) => {
    setEditingId(question._id);
    setShowForm(true);
    setForm({
      skill: question.skill || "",
      category: question.category || "",
      difficulty: question.difficulty || "Easy",
      question: question.question || "",
      options: question.options || ["", "", "", ""],
      correctAnswer: question.correctAnswer || "",
      explanation: question.explanation || "",
      isActive: question.isActive ?? true,
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;

    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete question");
    }
  };

  return (
    <DashboardLayout title="Question Bank" subtitle="Manage assessment questions">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Question Bank
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Add, edit, delete, search and filter assessment questions.
          </p>
        </div>

        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Add Question
        </Button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400">Total</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats?.totalQuestions || 0}
              </h3>
            </div>
            <BarChart3 className="text-blue-400" />
          </div>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">Active</p>
          <h3 className="mt-2 text-3xl font-bold text-green-400">
            {stats?.activeQuestions || 0}
          </h3>
        </Card>

        <Card>
          <p className="text-slate-600 dark:text-slate-400">Inactive</p>
          <h3 className="mt-2 text-3xl font-bold text-yellow-400">
            {stats?.inactiveQuestions || 0}
          </h3>
        </Card>
      </div>

      {showForm && (
        <Card className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? "Edit Question" : "Add Question"}
            </h2>

            <button
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-3">
              <Input
                label="Skill"
                name="skill"
                value={form.skill}
                onChange={handleChange}
                placeholder="Java"
              />

              <Input
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Programming"
              />

              <div>
                <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                Question
              </label>
              <textarea
                name="question"
                rows={3}
                value={form.question}
                onChange={handleChange}
                placeholder="Enter question"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {form.options.map((option, index) => (
                <Input
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>

            <Input
              label="Correct Answer"
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
              placeholder="Must exactly match one option"
            />

            <div>
              <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                Explanation
              </label>
              <textarea
                name="explanation"
                rows={3}
                value={form.explanation}
                onChange={handleChange}
                placeholder="Explain the correct answer"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active Question
            </label>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>

              <Button type="submit">
                <Save size={18} />
                Save Question
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="Search"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Search question"
          />

          <Input
            label="Skill"
            value={filters.skill}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, skill: e.target.value }))
            }
            placeholder="Java"
          />

          <div>
            <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  difficulty: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleFilter} className="w-full">
              <Search size={18} />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <p className="text-center text-slate-500">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-slate-500">No questions found.</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                        {q.skill}
                      </span>

                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                        {q.difficulty}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          q.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {q.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </h3>

                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {q.options.map((option) => (
                        <div
                          key={option}
                          className={`rounded-xl border px-3 py-2 text-sm ${
                            option === q.correctAnswer
                              ? "border-green-500 bg-green-500/10 text-green-400"
                              : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p className="mt-3 text-sm text-slate-500">
                        {q.explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(q)}
                    >
                      <Edit size={15} />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(q._id)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}