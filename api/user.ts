import api from "./index";

const endpoints = {
  getUsers: async () => {
    return await api("users");
  },
};

export default endpoints;
