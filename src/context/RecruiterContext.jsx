import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const RecruiterContext = createContext();

export const PIPELINE_STAGES = [
  "Shortlisted",
  "Interviewing",
  "Offer Sent",
  "Hired",
  "Rejected",
];

const SHORTLIST_KEY = "verixa_shortlist";
const PIPELINE_KEY = "verixa_pipeline";
const COMPARE_KEY = "verixa_compare";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const RecruiterProvider = ({ children }) => {
  // List of shortlisted developer ids
  const [shortlist, setShortlist] = useState(() =>
    readJSON(SHORTLIST_KEY, [])
  );

  // Map of developerId -> pipeline stage
  const [pipeline, setPipeline] = useState(() =>
    readJSON(PIPELINE_KEY, {})
  );

  // Up to 2 developer ids currently selected for comparison
  const [compareIds, setCompareIds] = useState(() =>
    readJSON(COMPARE_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(
      SHORTLIST_KEY,
      JSON.stringify(shortlist)
    );
  }, [shortlist]);

  useEffect(() => {
    localStorage.setItem(
      PIPELINE_KEY,
      JSON.stringify(pipeline)
    );
  }, [pipeline]);

  useEffect(() => {
    localStorage.setItem(
      COMPARE_KEY,
      JSON.stringify(compareIds)
    );
  }, [compareIds]);

  const isShortlisted = (id) => shortlist.includes(id);

  const addToShortlist = (id) => {
    setShortlist((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    setPipeline((prev) =>
      prev[id] ? prev : { ...prev, [id]: "Shortlisted" }
    );
  };

  const removeFromShortlist = (id) => {
    setShortlist((prev) => prev.filter((x) => x !== id));
    setPipeline((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleShortlist = (id) => {
    if (isShortlisted(id)) {
      removeFromShortlist(id);
    } else {
      addToShortlist(id);
    }
  };

  const getStage = (id) => pipeline[id] || "Shortlisted";

  const setStage = (id, stage) => {
    setPipeline((prev) => ({ ...prev, [id]: stage }));
  };

  const isComparing = (id) => compareIds.includes(id);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 2) {
        // Keep the most recently selected one and add the new one
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);

  const value = {
    shortlist,
    isShortlisted,
    addToShortlist,
    removeFromShortlist,
    toggleShortlist,
    pipeline,
    getStage,
    setStage,
    compareIds,
    isComparing,
    toggleCompare,
    clearCompare,
    setCompareIds,
  };

  return (
    <RecruiterContext.Provider value={value}>
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => {
  const context = useContext(RecruiterContext);

  if (!context) {
    throw new Error(
      "useRecruiter must be used within RecruiterProvider"
    );
  }

  return context;
};
