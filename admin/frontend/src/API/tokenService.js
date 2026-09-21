let accessToken = sessionStorage.getItem("token");

export const setToken = (token) => {
  accessToken = token;
  sessionStorage.setItem("token", token);
};

export const getToken = () => {
  return accessToken;
};

export const clearToken = () => {
  accessToken = null;
  sessionStorage.removeItem("token");
};