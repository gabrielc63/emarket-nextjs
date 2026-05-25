const defaultBaseUrl = "http://localhost:3002/v1/";

const configuredBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || defaultBaseUrl;

const baseUrl = configuredBaseUrl.endsWith("/")
  ? configuredBaseUrl
  : `${configuredBaseUrl}/`;

export default baseUrl;
