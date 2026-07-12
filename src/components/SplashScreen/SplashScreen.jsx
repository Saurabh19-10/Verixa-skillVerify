import { motion } from "framer-motion";

import verixaIcon from "../../assets/verixa-icon.png";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <motion.img
          src={verixaIcon}
          alt="Verixa"
          className="h-20 w-20 object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h1
          className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-500 to-sky-400 bg-clip-text text-transparent">
            Verixa
          </span>
        </motion.h1>

        <motion.p
          className="text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Verify. Showcase. Get Hired.
        </motion.p>

        <motion.div
          className="mt-2 h-1 w-44 overflow-hidden rounded-full bg-slate-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.3, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
