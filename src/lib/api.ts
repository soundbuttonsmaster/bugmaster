export const API_BASE_URL = "https://api-s-t.softsove.com/api";
const API_ORIGIN = "https://api-s-t.softsove.com";
/** @deprecated Use getAttachmentUrl() to avoid double /media/ in URLs */
export const FILE_BASE_URL = API_ORIGIN + "/media";

/** Build full URL for an attachment so /media/ is not duplicated. */
export function getAttachmentUrl(attachment: string | null | undefined): string | null {
  if (!attachment) return null;
  if (attachment.startsWith("http")) return attachment;
  const path = attachment.startsWith("/") ? attachment : `/${attachment}`;
  return `${API_ORIGIN}${path}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(isFormData = false): HeadersInit {
    const token = localStorage.getItem("auth_token");
    const headers: HeadersInit = {
      ...(token ? { Authorization: `Token ${token}` } : {}),
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      if (isJson) {
        const error = await response.json();
        const msg =
          (error as Record<string, unknown>).detail ||
          (Array.isArray((error as Record<string, unknown>).email)
            ? (error as Record<string, string[]>).email?.[0]
            : null) ||
          (error as Record<string, unknown>).error ||
          "An error occurred";
        throw new ApiError(String(msg), response.status, error);
      }
      throw new ApiError("An error occurred", response.status);
    }

    if (response.status === 204) return {} as T;
    return isJson ? response.json() : ({} as T);
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) url.searchParams.append(key, String(value));
      });
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown, isFormData = false): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getAuthHeaders(isFormData),
      body: isFormData ? (data as FormData) : JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiService(API_BASE_URL);
