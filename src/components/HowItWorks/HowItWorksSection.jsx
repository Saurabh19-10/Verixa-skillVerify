import { motion } from "framer-motion";
import {
  GitBranch,
  FolderGit2,
  ClipboardCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

const steps = [
  {
    icon: <GitBranch size={30} />,
    title: "Connect GitHub",
    description:
      "Link your GitHub account and let Verixa analyze repositories, commits, and contributions.",
  },
  {
    icon: <FolderGit2 size={30} />,
    title: "Add Projects",
    description:
      "Submit GitHub repositories and live project links for verification.",
  },
  {
    icon: <ClipboardCheck size={30} />,
    title: "Skill Assessment",
    description:
      "Take coding challenges and technical assessments to validate skills.",
  },
  {
    icon: <ShieldCheck size={30} />,
    title: "Get Verified",
    description:
      "Receive verification scores, trust ratings, and skill badges.",
  },
  {
    icon: <Users size={30} />,
    title: "Get Discovered",
    description:
      "Recruiters can find and evaluate your verified profile with confidence.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 dark:bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            From GitHub Profile To
            <span className="text-blue-500">
              {" "}
              Verified Developer
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Follow a simple process to verify your
            skills and build trust with recruiters.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="
                relative
                rounded-3xl
                border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900
                p-8
                text-center
                hover:border-blue-500/30
                transition-all
              "
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}