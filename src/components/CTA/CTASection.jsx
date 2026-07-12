import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import Button from "../ui/Button";

export default function CTASection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200 dark:border-slate-800
            bg-gradient-to-r
            from-blue-600/10
            via-white dark:via-slate-900
            to-cyan-500/10
            p-10
            md:p-16
          "
        >
          {/* Background Glow */}
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 text-center">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              Get Started Today
            </span>

            <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-6xl">
              Ready To Prove
              <span className="text-blue-500">
                {" "}
                Your Skills?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
              Connect your GitHub account, verify your
              projects, complete assessments, and build a
              trusted developer profile that recruiters
              can rely on.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg">
                Get Verified
                <ArrowRight size={18} />
              </Button>

              <Button
                variant="outline"
                size="lg"
              >
                <GitBranch size={18} />
                Connect GitHub
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-10">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
