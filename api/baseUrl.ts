const baseUrls = {
  development: "http://localhost:3000/v1/",
  staging: "",
  production: "",
  test: "",
};

const baseUrl = baseUrls[process.env.NODE_ENV || "development"];

export default baseUrl;
