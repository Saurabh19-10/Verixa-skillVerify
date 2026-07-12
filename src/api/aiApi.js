import api from "./api";

export const getAIReview = async () => {
  const { data } = await api.get("/ai/review");
  return data.review;
};

export const generateAIReview = async () => {
  const { data } = await api.post("/ai/review");
  return data.review;
};