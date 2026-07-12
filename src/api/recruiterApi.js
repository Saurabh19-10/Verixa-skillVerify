import api from "./api";

export const getRecruiterDashboard = async () => {
  const { data } = await api.get("/recruiter/dashboard");
  return data.stats;
};
export const getRecruiterAnalytics = async () => {
    const { data } = await api.get("/recruiter/analytics");
    return data.analytics;
  };
export const searchDevelopers = async (
  query = "",
  skill = "",
  minScore = ""
) => {
  const { data } = await api.get("/recruiter/developers", {
    params: {
      q: query,
      skill,
      minScore,
    },
  });

  return data.developers;
};

export const getDeveloperDetails = async (id) => {
  const { data } = await api.get(
    `/recruiter/developers/${id}`
  );

  return data;
};