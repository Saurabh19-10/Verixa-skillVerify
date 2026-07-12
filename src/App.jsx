import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>
      <AppRoutes />
    </>
  );
}

export default App;
