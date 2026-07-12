import api from "./api";

export const connectGitHub = async (username) => {
  const { data } = await api.post("/github/verify", {
    username,
  });

  return data;
};

export const getGitHubProfile = async () => {
  const { data } = await api.get("/github/profile");
  return data;
};

export const refreshGitHub = async () => {
  const { data } = await api.post("/github/refresh");
  return data;
};