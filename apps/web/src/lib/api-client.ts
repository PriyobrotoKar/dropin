import type { z } from "zod";
import { getSession } from "@/features/auth/lib/session";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  code: number;
  success: boolean;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.success = code < 400;
  }
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<S extends z.ZodType>(
    path: string,
    schema: S,
    options?: RequestInit
  ): Promise<z.output<S>> {
    const session = await getSession();
    const Cookie = session?.access_token
      ? `access_token=${session.access_token}`
      : "";

    const response = await fetch(`${BACKEND_URL}${this.baseUrl}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(options?.headers ?? {}),
        Cookie,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new ApiError(result.message, response.status);
    }

    // 204s and handlers that return nothing send an empty body
    const text = await response.text();
    const result = schema.safeParse(text ? JSON.parse(text) : undefined);

    if (!result.success) {
      console.error(`Invalid response from ${path}`, result.error);
      throw new ApiError("Unexpected response from server", response.status);
    }

    return result.data;
  }

  async get<S extends z.ZodType>(path: string, schema: S) {
    return this.fetch(path, schema);
  }

  async post<S extends z.ZodType>(path: string, data: unknown, schema: S) {
    return this.fetch(path, schema, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<S extends z.ZodType>(path: string, data: unknown, schema: S) {
    return this.fetch(path, schema, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<S extends z.ZodType>(path: string, schema: S) {
    return this.fetch(path, schema, {
      method: "DELETE",
    });
  }
}
