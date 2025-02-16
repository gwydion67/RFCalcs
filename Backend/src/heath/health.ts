import { api } from "encore.dev/api";

export const awake = api(
  { method: "GET", path: "/health/awake", expose: true },
  async (): Promise<Response> => {
    return {
      message: "hello i am awake"
    }
  }
)

interface Response {
  message: string
}
