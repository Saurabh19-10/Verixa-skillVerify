import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import {
  Brain,
  Clock,
  Play,
  Trophy,
  BookOpen,
  Sparkles,
} from "lucide-react";

import {
  getSkillAssessments,
  startSkillAssessment,
} from "../../api/skillAssessmentApi";

export default function Assessments() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingSkill, setStartingSkill] = useState("");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);

      const data = await getSkillAssessments();

      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load assessments:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load assessments."
      );
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (skill) => {
    if (!skill || startingSkill) {
      return;
    }

    try {
      setStartingSkill(skill);

      const assessment = await startSkillAssessment(skill);

      if (!assessment?.questions?.length) {
        throw new Error(
          "Assessment questions were not received from the server."
        );
      }

      navigate("/developer/assessment", {
        state: assessment,
      });
    } catch (error) {
      console.error("Failed to start assessment:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start assessment."
      );
    } finally {
      setStartingSkill("");
    }
  };

  const questionsPerTest =
    tests[0]?.totalQuestions || 15;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[75vh] items-center justify-center">
          <div className="text-center">
            <Brain className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500" />

            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Loading Assessments...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl dark:border-slate-800">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="text-yellow-300" size={22} />

              <span className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                AI Powered Assessments
              </span>
            </div>

            <h1 className="text-4xl font-extrabold">
              Skill Assessments
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Verixa automatically generates assessments
              based on your profile skills. Complete tests,
              earn certificates and improve your Trust Score.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <h2 className="text-3xl font-bold">
                {tests.length}
              </h2>

              <p className="text-sm text-blue-100">
                Available Tests
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <h2 className="text-3xl font-bold">
                {questionsPerTest}
              </h2>

              <p className="text-sm text-blue-100">
                Questions/Test
              </p>
            </div>
          </div>
        </div>
      </div>

      {tests.length === 0 ? (
        <Card className="rounded-3xl py-20 text-center shadow-lg">
          <BookOpen
            size={70}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            No Assessments Available
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            We couldn't find any assessment matching your
            profile skills. Add technical skills to your
            profile or ask the admin to generate the question
            bank.
          </p>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => {
            const isStarting =
              startingSkill === test.skill;

            return (
              <Card
                key={test.skill}
                className="group rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="rounded-2xl bg-blue-500/10 p-4">
                    <Brain
                      size={34}
                      className="text-blue-500"
                    />
                  </div>

                  <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-500">
                    {test.skill}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {test.skill} Assessment
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  AI-generated assessment based on your
                  technical skill.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <BookOpen
                        size={18}
                        className="text-blue-500"
                      />

                      <span className="text-slate-700 dark:text-slate-300">
                        Questions
                      </span>
                    </div>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {test.totalQuestions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <Clock
                        size={18}
                        className="text-amber-500"
                      />

                      <span className="text-slate-700 dark:text-slate-300">
                        Duration
                      </span>
                    </div>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {test.duration} min
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <Trophy
                        size={18}
                        className="text-green-500"
                      />

                      <span className="text-slate-700 dark:text-slate-300">
                        Passing
                      </span>
                    </div>

                    <span className="font-semibold text-green-500">
                      {test.passingPercentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <Brain
                        size={18}
                        className="text-purple-500"
                      />

                      <span className="text-slate-700 dark:text-slate-300">
                        Question Bank
                      </span>
                    </div>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {test.availableQuestions}
                    </span>
                  </div>
                </div>

                <Button
                  className="mt-8 w-full"
                  disabled={Boolean(startingSkill)}
                  onClick={() => startTest(test.skill)}
                >
                  <Play size={18} />

                  {isStarting
                    ? "Starting..."
                    : "Start Assessment"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}