import { defaultConfig } from "next/dist/server/config-shared";
import userEndpoints from "./user";

const endpoints = {
  users: userEndpoints,
};

export default endpoints;
