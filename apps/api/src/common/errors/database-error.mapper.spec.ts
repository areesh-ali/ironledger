import { describe, it, expect } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import { mapDatabaseError } from './database-error.mapper';
import { SYSTEM_CODES } from '../constants/system-codes';

describe('mapDatabaseError', () => {
  it('should map a direct postgres unique violation for email', () => {
    const error = {
      code: '23505',
      constraint: 'users_email_ci_uq',
    };

    const mapped = mapDatabaseError(error);
    expect(mapped).not.toBeNull();
    expect(mapped?.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(mapped?.getResponse()).toEqual({
      message: 'Unable to create account',
      system_code: SYSTEM_CODES.USER_EMAIL_EXISTS,
    });
  });

  it('should traverse cause chain to find wrapped database errors', () => {
    const wrappedError = {
      name: 'DrizzleQueryError',
      cause: {
        name: 'DatabaseError',
        cause: {
          code: '23505',
          constraint: 'organizations_slug_uq',
        },
      },
    };

    const mapped = mapDatabaseError(wrappedError);
    expect(mapped).not.toBeNull();
    expect(mapped?.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(mapped?.getResponse()).toEqual({
      message: 'Organization identifier is unavailable',
      system_code: SYSTEM_CODES.ORGANIZATION_SLUG_EXISTS,
    });
  });

  it('should return null for unrecognized constraints', () => {
    const error = {
      code: '23505',
      constraint: 'unknown_constraint',
    };

    expect(mapDatabaseError(error)).toBeNull();
  });

  it('should return null for non-database errors', () => {
    expect(mapDatabaseError(new Error('Random failure'))).toBeNull();
    expect(mapDatabaseError(null)).toBeNull();
    expect(mapDatabaseError(undefined)).toBeNull();
  });

  it('should stop traversal beyond depth limit', () => {
    let deepError: any = { code: '23505', constraint: 'users_email_ci_uq' };
    for (let i = 0; i < 6; i++) {
      deepError = { cause: deepError };
    }

    expect(mapDatabaseError(deepError)).toBeNull();
  });
});
