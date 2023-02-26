export interface ErrorResponse {
  error: {
    code?: string | null
    reasons: Array<string>
  }
}
