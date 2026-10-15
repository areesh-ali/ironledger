import { AppException } from './app.exception';

import { DATABASE_ERROR_REGISTRY } from './database-error.registry';

export function mapDatabaseError(
  error: unknown,
): AppException | null {
  let current: unknown = error;

  // Drizzle may wrap the PostgreSQL error in `cause`.
  for (let depth = 0; depth < 5; depth++) {
    if (
      current === null ||
      typeof current !== 'object'
    ) {
      break;
    }

    const candidate = current as {
      code?: unknown;
      constraint?: unknown;
      cause?: unknown;
    };

    if (
      typeof candidate.code === 'string' &&
      typeof candidate.constraint === 'string'
    ) {
      const definition =
        DATABASE_ERROR_REGISTRY[candidate.constraint];

      if (
        definition &&
        definition.pgCode === candidate.code
      ) {
        return new AppException(
          definition.httpStatus,
          definition.message,
          definition.systemCode,
        );
      }
    }

    current = candidate.cause;
  }

  return null;
}
