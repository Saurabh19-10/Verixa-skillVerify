import api from "./api";

// =========================================
// Projects
// =========================================

export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data.projects;
};

export const getProjectById = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data.project;
};

export const createProject = async (projectData) => {
  const { data } = await api.post("/projects", projectData);
  return data.project;
};

export const updateProject = async (id, projectData) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data.project;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

// =========================================
// Project Verification
// =========================================

export const verifyProject = async (projectId) => {
  const { data } = await api.post(
    `/verification/project/${projectId}`
  );

  return data;
};

export const refreshProjectVerification = async (
  projectId
) => {
  const { data } = await api.post(
    `/verification/project/${projectId}`
  );

  return data;
};

export const getVerificationScore = async (
  projectId
) => {
  const { data } = await api.get(
    `/projects/${projectId}`
  );

  return {
    verificationScore:
      data.project.verificationScore,

    verificationStatus:
      data.project.verificationStatus,

    verificationBreakdown:
      data.project.verificationBreakdown,

    githubAnalytics:
      data.project.githubAnalytics,
  };
};