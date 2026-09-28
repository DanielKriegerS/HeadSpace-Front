import { FieldViolation } from "./FieldViolation";

export interface HeadSpaceProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: string;
  timestamp: string;
  correlationId: string;
  violations?: FieldViolation[];
}