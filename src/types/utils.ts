export interface ActionResponse<T> {
  status: "SUCCESS" | "ERROR" | "PENDING";
  success?: string;
  error?: string;
  data?: T;
}
