import api from "./api";

export const getMyCertificates = async () => {
  const { data } = await api.get(
    "/certificates/my-certificates"
  );

  return data.certificates || [];
};
export const verifyCertificate = async (certificateId) => {
  const { data } = await api.get(
    `/certificates/verify/${certificateId}`
  );
  return data.certificate;
};