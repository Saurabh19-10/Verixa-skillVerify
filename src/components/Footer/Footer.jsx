import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

import verixaIcon from "../../assets/verixa-icon.png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-black p-1.5">
                <img src={verixaIcon} alt="Verixa" className="h-full w-full object-contain" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Verixa
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Proof of Skills
                </p>
              </div>
            </div>

            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Verify developer skills using GitHub activity, project
              validation, coding assessments, and AI-powered reviews.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-slate-900 dark:text-white font-semibold">
              Product
            </h3>

            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li>
                <a href="#features" className="hover:text-slate-900 dark:hover:text-white">
                  Features
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">
                  How It Works
                </a>
              </li>

              <li>
                <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-slate-900 dark:text-white font-semibold">
              Platform
            </h3>

            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/developer"
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  Developers
                </Link>
              </li>

              <li>
                <Link
                  to="/recruiter"
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  Recruiters
                </Link>
              </li>

              <li>
                <a href="/" className="hover:text-slate-900 dark:hover:text-white">
                  Verification
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-slate-900 dark:text-white font-semibold">
              Connect
            </h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-slate-900 dark:hover:text-white"
              >
                <Globe size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-slate-900 dark:hover:text-white"
              >
                <Globe size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-slate-900 dark:hover:text-white"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 Verixa. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-slate-900 dark:hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}