import api from "./api";

export const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data.user;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/users/profile", profileData);
  return data.user;
};