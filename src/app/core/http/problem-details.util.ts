import { HeadSpaceProblemDetail } from '../models/HeadSpaceProblemDetail';

export function isHeadSpaceProblemDetail(
  value: unknown
): value is HeadSpaceProblemDetail {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value['type'] === 'string' &&
    typeof value['title'] === 'string' &&
    typeof value['status'] === 'number' &&
    typeof value['detail'] === 'string' &&
    typeof value['instance'] === 'string' &&
    typeof value['code'] === 'string' &&
    typeof value['timestamp'] === 'string'
  );
}

export function getProblemDetail(
  value: unknown
): HeadSpaceProblemDetail | null {
  return isHeadSpaceProblemDetail(value)
    ? value
    : null;
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}