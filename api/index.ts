import axios from "axios";

import baseURL from "./baseUrl";
import { getAccessToken } from "./authToken";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 1000,
});

type ApiOptions = {
  data?: object;
  skipRefresh?: boolean;
  method?: "get" | "patch" | "put" | "post" | "delete";
  params?: object;
};

export type ApiResponse<T> = {
  data: T;
  headers: Record<string, string>;
};

const authHeaders = () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return {};
  }

  return {
    Authorization: accessToken,
  };
};

export const api = async <T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> => {
  const response = await apiWithResponse<T>(url, options);

  return response.data;
};

export const apiWithResponse = async <T>(
  url: string,
  options: ApiOptions = {},
): Promise<ApiResponse<T>> => {
  const { data, method = "get", params } = options;

  try {
    const response = await axiosInstance.request({
      data,
      headers: authHeaders(),
      method,
      params,
      responseType: "json",
      url,
    });

    return {
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !options.skipRefresh
    ) {
      const { refreshAccessToken } = await import("./auth");
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        return await apiWithResponse<T>(url, {
          ...options,
          skipRefresh: true,
        });
      }
    }

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
