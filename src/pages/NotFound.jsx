import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div
      className="
        flex min-h-screen items-center justify-center
        bg-slate-50 dark:bg-slate-950 px-6
      "
    >
      <div className="max-w-2xl text-center">
        {/* Icon */}
        <div
          className="
            mx-auto mb-8 flex h-32 w-32
            items-center justify-center
            rounded-full
            bg-blue-500/10
          "
        >
          <SearchX
            size={60}
            className="text-blue-500"
          />
        </div>

        {/* Error Code */}
        <h1
          className="
            text-8xl font-extrabold
            text-slate-900 dark:text-white
            md:text-9xl
          "
        >
          404
        </h1>

        {/* Heading */}
        <h2
          className="
            mt-6 text-3xl
            font-bold text-slate-900 dark:text-white
          "
        >
          Page Not Found
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto mt-4 max-w-xl
            text-lg text-slate-600 dark:text-slate-400
          "
        >
          The page you are looking for does not exist,
          may have been moved, or is temporarily
          unavailable.
        </p>

        {/* Buttons */}
        <div
  className="
    mt-10 flex flex-col
    justify-center gap-4
    sm:flex-row
  "
>
  <Link to="/">
    <span>
      <Button>
        <Home size={18} />
        Back Home
      </Button>
    </span>
  </Link>

  <Button
    variant="secondary"
    onClick={() => window.history.back()}
  >
    <ArrowLeft size={18} />
    Go Back
  </Button>
</div>

        {/* Extra */}
        <div
          className="
            mt-12 rounded-2xl
            border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
            p-6
          "
        >
          <h3
            className="
              mb-3 text-lg
              font-semibold text-slate-900 dark:text-white
            "
          >
            Need Help?
          </h3>

          <p className="text-slate-600 dark:text-slate-400">
            Try navigating from the dashboard,
            search developers, or return to the
            homepage.
          </p>
        </div>
      </div>
    </div>
  );
}