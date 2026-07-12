import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import {
  getAssessment,
  submitAssessment,
} from "../../api/assessmentApi";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Send,
  Trophy,
  AlertTriangle,
} from "lucide-react";

export default function AssessmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  const submittedRef = useRef(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await getAssessment(id);

        setAssessment(data);
        setTimeLeft((data.duration || 30) * 60);

        setAnswers(
          data.questions.map((question) => ({
            questionId: question.id,
            question: question.question,
            selectedAnswer: "",
          }))
        );
      } catch (error) {
        console.error(error);
        alert(
          error.response?.data?.message ||
            "Failed to load assessment"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const handleSubmit = async (isAuto = false) => {
    if (submittedRef.current || !assessment) return;

    try {
      submittedRef.current = true;
      setSubmitting(true);
      setAutoSubmitting(isAuto);

      const formattedAnswers = answers.map((item, index) => ({
        questionId:
          item.questionId || assessment.questions[index].id,
        question:
          item.question || assessment.questions[index].question,
        selectedAnswer: item.selectedAnswer || "",
      }));

      const data = await submitAssessment(id, formattedAnswers);
      setResult(data);
    } catch (error) {
      submittedRef.current = false;
      alert(
        error.response?.data?.message ||
          "Failed to submit assessment"
      );
    } finally {
      setSubmitting(false);
      setAutoSubmitting(false);
    }
  };

  useEffect(() => {
    if (!assessment || result || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, result, timeLeft]);

  useEffect(() => {
    if (!assessment || result) return;

    const addWarning = (reason) => {
      setWarnings((prev) => {
        const next = prev + 1;

        alert(`${reason}. Warning ${next}/3`);

        if (next >= 3) {
          handleSubmit(true);
        }

        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addWarning("Tab switch detected");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      addWarning("Right click is disabled during assessment");
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      addWarning("Copy/Paste is disabled during assessment");
    };

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (
        key === "f12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) ||
        (e.ctrlKey && ["c", "v", "x", "u"].includes(key)) ||
        (e.metaKey && ["c", "v", "x", "u"].includes(key))
      ) {
        e.preventDefault();
        addWarning("Restricted shortcut detected");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [assessment, result, answers]);

  const handleSelectAnswer = (answer) => {
    const current = assessment.questions[currentQuestion];

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = {
      questionId: current.id,
      question: current.question,
      selectedAnswer: answer,
    };

    setAnswers(updatedAnswers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Loading Assessment...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <Card className="text-center">
          <p className="text-red-400">Assessment not found.</p>
        </Card>
      </DashboardLayout>
    );
  }

  if (result) {
    return (
      <DashboardLayout>
        <Card className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <Trophy size={42} className="text-yellow-400" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            Assessment Completed
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {autoSubmitting
              ? "Your assessment was auto-submitted."
              : "Your score has been saved successfully."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Score</p>
              <h3 className="mt-2 text-3xl font-bold text-blue-400">
                {result.score}/20
              </h3>
            </div>

            <div className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Percentage</p>
              <h3 className="mt-2 text-3xl font-bold text-green-400">
                {result.percentage}%
              </h3>
            </div>

            <div className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Status</p>
              <h3
                className={`mt-2 text-2xl font-bold ${
                  result.passed ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.passed ? "Passed" : "Failed"}
              </h3>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/developer/assessments")}
            >
              Back to Assessments
            </Button>

            <Button onClick={() => navigate("/developer/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const question = assessment.questions[currentQuestion];
  const totalQuestions = assessment.questions.length;

  const answeredCount = answers.filter(
    (item) => item.selectedAnswer
  ).length;

  const progress = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  const currentAnswer =
    answers[currentQuestion]?.selectedAnswer || "";

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {assessment.title}
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {assessment.skill || assessment.category} • {assessment.level}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              timeLeft <= 300
                ? "bg-red-500/10 text-red-400"
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-yellow-400">
            <AlertTriangle size={18} />
            Warnings {warnings}/3
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Progress
          </span>

          <span className="font-semibold text-blue-400">
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>

        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-3 rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>

          {currentAnswer && (
            <span className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle size={16} />
              Answered
            </span>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {question.question}
        </h2>

        <div className="mt-8 space-y-4">
          {question.options.map((option) => {
            const selected = currentAnswer === option;

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="secondary"
            disabled={currentQuestion === 0}
            onClick={() =>
              setCurrentQuestion((prev) => Math.max(prev - 1, 0))
            }
          >
            <ArrowLeft size={18} />
            Previous
          </Button>

          {currentQuestion === totalQuestions - 1 ? (
            <Button
              disabled={submitting || answeredCount !== totalQuestions}
              onClick={() => handleSubmit(false)}
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestion((prev) =>
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
    </DashboardLayout>
  );
}