import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("verixa_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAssessments = async () => {
  const { data } = await API.get("/assessments");
  return data.assessments;
};

export const getAssessment = async (id) => {
  const { data } = await API.get(`/assessments/${id}`);
  return data.assessment;
};

export const submitAssessment = async (id, answers) => {
  const { data } = await API.post(
    `/assessments/${id}/submit`,
    { answers }
  );

  return data.result;
};

export const getMyResults = async () => {
  const { data } = await API.get(
    "/assessments/my/results"
  );

  return data.results;
};