import api from "./api";

export const getSkillAssessments = async () => {
  const { data } = await api.get("/skill-assessments");

  return data.tests || [];
};

export const startSkillAssessment = async (skill) => {
  const { data } = await api.post("/skill-assessments/start", {
    skill,
  });

  return data.assessment;
};

export const submitSkillAssessment = async (payload) => {
  const { data } = await api.post(
    "/skill-assessments/submit",
    payload
  );

  return data;
};

export const getMySkillResults = async () => {
  const { data } = await api.get(
    "/skill-assessments/my-results"
  );

  return data.results || [];
};