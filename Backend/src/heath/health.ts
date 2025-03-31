import { api } from "encore.dev/api";

export const awake = api(
  { method: "GET", path: "/health/awake", expose: true },
  async (): Promise<Response> => {
    // This is a simple health check endpoint

    return {
      message: "hello i am awake"
    }
  }
)

interface Response {
  message: string
}
