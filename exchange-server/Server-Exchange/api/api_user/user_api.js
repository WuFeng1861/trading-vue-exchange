import instance from "./user_instance.js";

export const checkToken = (token, id) => {
  return instance.post('/token/checkToken', {token, id});
};

export const getEmail = (id) => {
  return instance.post('/user/getemail', {id});
};

export const login = (username, email, password) => {
  return instance.post('/user/login', {username, email, password});
};
