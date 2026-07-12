import { motion } from "framer-motion";
import {
  GitBranch,
  BadgeCheck,
  Briefcase,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: <GitBranch size={32} />,
    title: "GitHub Verification",
    description:
      "Analyze repositories, commits, pull requests, and contribution activity to verify real-world development experience.",
  },
  {
    icon: <BadgeCheck size={32} />,
    title: "Skill Assessment",
    description:
      "Validate technical skills through coding challenges, MCQ tests, and instant evaluation reports.",
  },
  {
    icon: <Briefcase size={32} />,
    title: "Project Verification",
    description:
      "Verify projects using GitHub repositories, live demos, documentation checks, and tech stack analysis.",
  },
  {
    icon: <Brain size={32} />,
    title: "AI Portfolio Review",
    description:
      "Get ATS checks, portfolio scoring, improvement suggestions, and AI-powered feedback.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-slate-50 dark:bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Core Features
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Everything Needed To Verify
            <span className="text-blue-500">
              {" "}
              Developer Skills
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Verixa helps developers prove their
            abilities and enables recruiters to hire
            with confidence using verified data.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              className="
                group
                rounded-3xl
                border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900
                p-8
                transition-all
                duration-300
                hover:border-blue-500/30
                hover:-translate-y-2
              "
            >
              {/* Icon */}
              <div
                className="
                  mb-6
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-500/10
                  text-blue-500
                "
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}