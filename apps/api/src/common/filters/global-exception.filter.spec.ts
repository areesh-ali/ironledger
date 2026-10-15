import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';
import { AppException } from '../errors/app.exception';
import { SYSTEM_CODES } from '../constants/system-codes';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockHttpAdapter: { reply: any };
  let mockHost: any;
  let responseObj: any;

  beforeEach(() => {
    responseObj = {};
    mockHttpAdapter = {
      reply: vi.fn(),
    };

    const mockAdapterHost = {
      httpAdapter: mockHttpAdapter,
    } as unknown as HttpAdapterHost;

    filter = new GlobalExceptionFilter(mockAdapterHost);

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => responseObj,
      }),
    };
  });

  it('should handle AppException and format response', () => {
    const exception = new AppException(
      HttpStatus.FORBIDDEN,
      'You cannot access this organization',
      SYSTEM_CODES.ORGANIZATION_ACCESS_DENIED,
    );

    filter.catch(exception, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      responseObj,
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You cannot access this organization',
        system_code: SYSTEM_CODES.ORGANIZATION_ACCESS_DENIED,
      },
      HttpStatus.FORBIDDEN,
    );
  });

  it('should automatically map recognized database errors', () => {
    const dbError = {
      cause: {
        code: '23505',
        constraint: 'users_email_ci_uq',
      },
    };

    filter.catch(dbError, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      responseObj,
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'Unable to create account',
        system_code: SYSTEM_CODES.USER_EMAIL_EXISTS,
      },
      HttpStatus.CONFLICT,
    );
  });

  it('should handle validation BadRequestException with error array', () => {
    const exception = new BadRequestException([
      'email must be an email',
      'password is too weak',
    ]);

    filter.catch(exception, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      responseObj,
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        system_code: SYSTEM_CODES.VALIDATION_FAILED,
        data: {
          errors: ['email must be an email', 'password is too weak'],
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should mask unexpected 500 errors', () => {
    const exception = new Error('Secret database connection string leaked!');

    filter.catch(exception, mockHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      responseObj,
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        system_code: SYSTEM_CODES.INTERNAL_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
