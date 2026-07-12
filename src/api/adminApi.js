import api from "./api";

export const getAdminAnalytics = async () => {
  const { data } = await api.get("/admin/analytics");
  return data.analytics;
};

export const getAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data.users;
};

export const deleteAdminUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const getAdminProjects = async () => {
  const { data } = await api.get("/admin/projects");
  return data.projects;
};

export const getAdminAssessments = async () => {
  const { data } = await api.get("/admin/assessments");
  return data.assessments;
};

export const getAdminAIReviews = async () => {
  const { data } = await api.get("/admin/ai-reviews");
  return data.reviews;
};
