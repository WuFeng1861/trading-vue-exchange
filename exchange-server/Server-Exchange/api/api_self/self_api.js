import instance from "./self_instance.js";

export const getbalance = (id, token) => {
  return instance.post('/mint/getbalance', {id: id}, {
    headers: {
      "Authorization": `Bearer ${token} ${id}`
    }
  });
};
