import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { HttpAdapterHost } from '@nestjs/core';

import {
  SYSTEM_CODES,
  type SystemCode,
} from '../constants/system-codes';

import { mapDatabaseError } from '../errors/database-error.mapper';

import type { ApiResponse } from '../interfaces/api-response.interface';

const KNOWN_CODES: ReadonlySet<string> =
  new Set(Object.values(SYSTEM_CODES));

function isSystemCode(value: unknown): value is SystemCode {
  return (
    typeof value === 'string' &&
    KNOWN_CODES.has(value)
  );
}

function fallbackCode(status: number): SystemCode {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return SYSTEM_CODES.VALIDATION_FAILED;

    case HttpStatus.UNAUTHORIZED:
      return SYSTEM_CODES.AUTH_REQUIRED;

    case HttpStatus.FORBIDDEN:
      return SYSTEM_CODES.AUTH_FORBIDDEN;

    case HttpStatus.NOT_FOUND:
      return SYSTEM_CODES.RESOURCE_NOT_FOUND;

    case HttpStatus.TOO_MANY_REQUESTS:
      return SYSTEM_CODES.RATE_LIMIT_EXCEEDED;

    default:
      return status >= 500
        ? SYSTEM_CODES.INTERNAL_ERROR
        : SYSTEM_CODES.REQUEST_FAILED;
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    GlobalExceptionFilter.name,
  );

  constructor(
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const mapped = mapDatabaseError(exception);
    const resolved = mapped ?? exception;

    const statusCode =
      resolved instanceof HttpException
        ? resolved.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse =
      resolved instanceof HttpException
        ? resolved.getResponse()
        : undefined;

    const body: Record<string, unknown> =
      rawResponse !== null &&
      typeof rawResponse === 'object' &&
      !Array.isArray(rawResponse)
        ? (rawResponse as Record<string, unknown>)
        : {};

    const rawMessage =
      body.message ??
      (typeof rawResponse === 'string'
        ? rawResponse
        : undefined);

    const message =
      statusCode >= 500
        ? 'Internal server error'
        : Array.isArray(rawMessage)
          ? 'Validation failed'
          : typeof rawMessage === 'string'
            ? rawMessage
            : 'Request failed';

    const systemCode =
      statusCode >= 500
        ? SYSTEM_CODES.INTERNAL_ERROR
        : isSystemCode(body.system_code)
          ? body.system_code
          : fallbackCode(statusCode);

    const payload: ApiResponse = {
      statusCode,
      message,
      system_code: systemCode,
    };

    if (
      statusCode === HttpStatus.BAD_REQUEST &&
      Array.isArray(rawMessage)
    ) {
      payload.data = {
        errors: rawMessage.filter(
          (item): item is string =>
            typeof item === 'string',
        ),
      };
    } else if (
      statusCode < 500 &&
      body.data !== undefined
    ) {
      payload.data = body.data;
    }

    if (!(resolved instanceof HttpException)) {
      const errorType =
        exception instanceof Error
          ? exception.name
          : typeof exception;

      this.logger.error(
        `Unhandled exception type: ${errorType}`,
      );
    }

    const http = host.switchToHttp();

    this.adapterHost.httpAdapter.reply(
      http.getResponse(),
      payload,
      statusCode,
    );
  }
}
