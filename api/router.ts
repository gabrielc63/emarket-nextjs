import authEndpoints from "./auth";
import productEndpoints from "./product";
import userEndpoints from "./user";

const endpoints = {
  auth: authEndpoints,
  products: productEndpoints,
  users: userEndpoints,
};

export default endpoints;
