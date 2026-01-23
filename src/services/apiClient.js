const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function buildApiUrl(endpoint) {
  if (endpoint.startsWith("http")) return endpoint;
  if (!endpoint.startsWith("/")) endpoint = `/${endpoint}`;
  return `${API_BASE_URL}${endpoint}`;
}
