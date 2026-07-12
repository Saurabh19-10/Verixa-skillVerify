import { motion } from "framer-motion";
import { ShieldCheck, GitBranch, Award } from "lucide-react";
import Button from "../ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Blur Effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              <ShieldCheck size={16} />
              Trusted Developer Verification Platform
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900 dark:text-white lg:text-7xl">
              Proof of Skills,
              <span className="block text-blue-500">
                Not Just Claims.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
              Verify developer skills using GitHub activity,
              project validation, coding assessments,
              and AI-powered portfolio reviews.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">
                Get Verified
              </Button>

              <Button
                variant="outline"
                size="lg"
              >
                Explore Profiles
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-10">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  10K+
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Developers
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  50K+
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Verified Projects
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  2K+
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Recruiters
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="space-y-5">
              
              {/* GitHub Verification */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <div className="flex items-center gap-4">
                  <GitBranch className="text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      GitHub Verification
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Commit & Contribution Analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* Skill Assessment */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <div className="flex items-center gap-4">
                  <Award className="text-green-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Skill Assessment
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Coding Challenges & Tests
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Score */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Trust Score
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Based on Verification Engine
                    </p>
                  </div>

                  <div className="text-4xl font-bold text-blue-500">
                    92
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}