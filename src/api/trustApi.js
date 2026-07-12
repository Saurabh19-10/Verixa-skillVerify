import api from "./api";

export const calculateTrustScore = async () => {
  const { data } = await api.post("/trust/calculate");
  return data;
};