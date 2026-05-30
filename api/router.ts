import authEndpoints from "./auth";
import productEndpoints from "./product";
import userEndpoints from "./user";
import wishlistEndpoints from "./wishlist";

const endpoints = {
  auth: authEndpoints,
  products: productEndpoints,
  users: userEndpoints,
  wishlists: wishlistEndpoints,
};

export default endpoints;
