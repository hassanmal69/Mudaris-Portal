export const validationTokenInvite = async (token) => {
  const res = await axios.post("/api/inviteValidation", {
    token: token,
  });
  return res.data?.data?.[0] || null;
};
