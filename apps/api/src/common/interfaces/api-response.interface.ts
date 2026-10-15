export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  system_code: string;
  data?: T;
}
