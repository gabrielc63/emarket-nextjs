import axios from "axios";

import baseURL from "./baseUrl";

const axiosInstance = axios.create({
  baseURL,
  timeout: 1000,
});

type ApiOptions = {
  data?: object;
  method?: "get" | "put" | "post" | "delete";
  params?: object;
};

export const api = async <T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> => {
  const { data, method = "get", params } = options;

  try {
    const response = await axiosInstance.request({
      data,
      method,
      params,
      responseType: "json",
      url,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; errors?: string | string[] }>(error)) {
      const message =
        error.response?.data?.errors ??
        error.response?.data?.error ??
        error.message;

      throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }

    throw error;
  }
};

export default api;
