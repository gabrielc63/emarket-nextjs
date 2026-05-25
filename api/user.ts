import api from "./index";

type Endpoints = {
  getUsers: () => Promise<APISchema.User[]>;
};

const endpoints: Endpoints = {
  getUsers: async () => {
    return await api<APISchema.User[]>("users");
  },
};

export default endpoints;
