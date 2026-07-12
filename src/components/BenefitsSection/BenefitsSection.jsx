import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Search,
  TrendingUp,
  Users,
  BadgeCheck,
} from "lucide-react";

const benefits = [
  {
    icon: <ShieldCheck size={30} />,
    title: "Verified Credibility",
    description:
      "Showcase proof of skills with verified projects, GitHub activity, and trust scores.",
  },
  {
    icon: <Award size={30} />,
    title: "Skill Recognition",
    description:
      "Earn badges and certifications through assessments and project verification.",
  },
  {
    icon: <TrendingUp size={30} />,
    title: "Career Growth",
    description:
      "Stand out from the crowd and increase your chances of getting hired.",
  },
  {
    icon: <Search size={30} />,
    title: "Smarter Hiring",
    description:
      "Recruiters can discover developers using verified performance metrics.",
  },
  {
    icon: <Users size={30} />,
    title: "Trusted Profiles",
    description:
      "Access transparent developer profiles backed by real activity and assessments.",
  },
  {
    icon: <BadgeCheck size={30} />,
    title: "Reduced Hiring Risk",
    description:
      "Make confident hiring decisions with objective verification data.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Benefits
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Why Developers &
            <span className="text-blue-500">
              {" "}
              Recruiters Love Verixa
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Build trust, validate skills, and make hiring
            decisions based on evidence instead of claims.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="
                rounded-3xl
                border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-500/30
              "
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                {benefit.icon}
              </div>

              <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                {benefit.title}
              </h3>

              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}