import api from "./api";

export const getQuestions = async (params = {}) => {
  const { data } = await api.get("/questions", {
    params,
  });

  return data.questions;
};

export const getQuestionStats = async () => {
  const { data } = await api.get("/questions/stats");
  return data.stats;
};

export const createQuestion = async (payload) => {
  const { data } = await api.post("/questions", payload);
  return data.question;
};

export const updateQuestion = async (id, payload) => {
  const { data } = await api.put(`/questions/${id}`, payload);
  return data.question;
};

export const deleteQuestion = async (id) => {
  const { data } = await api.delete(`/questions/${id}`);
  return data;
};