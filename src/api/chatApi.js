import api from "./api";

export const getRecentChats = async () => {
  const { data } = await api.get("/chat/recent");
  return data.chats;
};

export const getConversation = async (userId) => {
  const { data } = await api.get(`/chat/${userId}`);
  return data.messages;
};

export const sendMessage = async (payload) => {
  const { data } = await api.post("/chat/send", payload);
  return data.chat;
};

export const markAsRead = async (userId) => {
  const { data } = await api.patch(`/chat/${userId}/read`);
  return data;
};
export const verifyCertificate = async (certificateId) => {
  const { data } = await api.get(
    `/certificates/verify/${certificateId}`
  );

  return data.certificate;
};