import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { submitSkillAssessment } from "../../api/skillAssessmentApi";

import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Send,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AssessmentPlayer() {
  const { state: assessment } = useLocation();
  const navigate = useNavigate();

  const totalQuestions = assessment?.questions?.length || 0;

  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    (assessment?.duration || 30) * 60
  );
  const [warnings, setWarnings] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const submittedRef = useRef(false);

  useEffect(() => {
    if (!assessment || !assessment.questions?.length) {
      navigate("/developer/assessments");
      return;
    }

    setAnswers(
      assessment.questions.map((q) => ({
        questionId: q._id,
        question: q.question,
        selectedAnswer: "",
      }))
    );
  }, [assessment, navigate]);

  const submitTest = async () => {
    if (submittedRef.current || !assessment) return;

    try {
      submittedRef.current = true;
      setSubmitting(true);

      const payload = {
        skill: assessment.skill,
        answers,
        warnings,
      };

      const data = await submitSkillAssessment(payload);

      navigate("/developer/dashboard", {
        state: {
          assessmentResult: data,
          message: `${assessment.skill} Assessment completed successfully`,
        },
      });
    } catch (err) {
      submittedRef.current = false;
      alert(err.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!assessment || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, answers, warnings, submitting]);

  useEffect(() => {
    if (!assessment || submitting) return;

    const warn = (msg) => {
      setWarnings((prev) => {
        const next = prev + 1;

        alert(`${msg}. Warning ${next}/3`);

        if (next >= 3) {
          setTimeout(submitTest, 300);
        }

        return next;
      });
    };

    const visibility = () => {
      if (document.hidden) warn("Tab switch detected");
    };

    const block = (e) => {
      e.preventDefault();
      warn("Restricted action detected");
    };

    const keydown = (e) => {
      const key = e.key.toLowerCase();

      if (
        key === "f12" ||
        (e.ctrlKey && ["c", "v", "x", "u"].includes(key)) ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        (e.metaKey && ["c", "v", "x", "u"].includes(key))
      ) {
        e.preventDefault();
        warn("Restricted shortcut detected");
      }
    };

    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);
    window.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
      window.removeEventListener("keydown", keydown);
    };
  }, [assessment, answers, warnings, submitting]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;
  };

  if (!assessment || !totalQuestions) return null;

  const q = assessment.questions[current];
  const selected = answers[current]?.selectedAnswer;
  const answered = answers.filter((a) => a.selectedAnswer).length;

  const progress = Math.round((answered / totalQuestions) * 100);

  const choose = (option) => {
    const copy = [...answers];

    copy[current] = {
      questionId: q._id,
      question: q.question,
      selectedAnswer: option,
    };

    setAnswers(copy);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-7 text-white shadow-xl dark:border-slate-800">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-200">
              <ShieldCheck size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Anti-cheat enabled
              </span>
            </div>

            <h1 className="text-4xl font-extrabold">
              {assessment.skill} Assessment
            </h1>

            <p className="mt-3 text-blue-100">
              {totalQuestions} randomized questions with timer and restricted
              actions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div
              className={`rounded-2xl px-5 py-3 font-bold ${
                timeLeft <= 300
                  ? "bg-red-500/20 text-red-200"
                  : "bg-white/10 text-blue-100"
              }`}
            >
              <Clock size={18} className="mr-2 inline" />
              {formatTime(timeLeft)}
            </div>

            <div className="rounded-2xl bg-yellow-500/20 px-5 py-3 font-bold text-yellow-200">
              <AlertTriangle size={18} className="mr-2 inline" />
              Warnings {warnings}/3
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit rounded-3xl shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Question Palette
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {assessment.questions.map((item, index) => {
              const isAnswered = answers[index]?.selectedAnswer;
              const isCurrent = current === index;

              return (
                <button
                  key={item._id}
                  onClick={() => setCurrent(index)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isAnswered
                      ? "bg-green-500/10 text-green-500"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <div className="mb-2 flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Progress</span>
              <span>
                {answered}/{totalQuestions}
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-3 rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              {progress}% completed
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600" />
              Current
            </p>
            <p className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Answered
            </p>
            <p className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              Not answered
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl shadow-lg">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-500">
                Question {current + 1} of {totalQuestions}
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Difficulty: {q.difficulty}
              </p>
            </div>

            {selected && (
              <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-500">
                <CheckCircle2 size={16} />
                Answered
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold leading-relaxed text-slate-900 dark:text-white">
            {q.question}
          </h2>

          <div className="mt-8 space-y-4">
            {q.options.map((option, index) => {
              const isSelected = selected === option;

              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 text-blue-500"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-500/5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="secondary"
              disabled={current === 0}
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
            >
              <ArrowLeft size={18} />
              Previous
            </Button>

            {current === totalQuestions - 1 ? (
              <Button
                disabled={submitting || answered !== totalQuestions}
                onClick={submitTest}
              >
                <Send size={18} />
                {submitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrent((prev) =>
                    Math.min(prev + 1, totalQuestions - 1)
                  )
                }
              >
                Next
                <ArrowRight size={18} />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}