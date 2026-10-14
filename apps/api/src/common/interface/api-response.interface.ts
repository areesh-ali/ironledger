interface ApiResponse<T = unknown> {
  statusCode: number,
  message: string,
  systemcode: string,
  data? : T
}
