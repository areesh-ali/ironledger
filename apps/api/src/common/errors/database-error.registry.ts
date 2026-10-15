import { HttpStatus } from '@nestjs/common';

import {
  SYSTEM_CODES,
  type SystemCode,
} from '../constants/system-codes';

export interface DatabaseErrorDefinition {
  pgCode: string;
  httpStatus: number;
  systemCode: SystemCode;
  message: string;
}

export const DATABASE_ERROR_REGISTRY: Readonly<
  Record<string, DatabaseErrorDefinition>
> = {
  users_email_ci_uq: {
    pgCode: '23505',
    httpStatus: HttpStatus.CONFLICT,
    systemCode: SYSTEM_CODES.USER_EMAIL_EXISTS,
    message: 'Unable to create account',
  },

  users_email_unique: {
    pgCode: '23505',
    httpStatus: HttpStatus.CONFLICT,
    systemCode: SYSTEM_CODES.USER_EMAIL_EXISTS,
    message: 'Unable to create account',
  },

  organizations_slug_uq: {
    pgCode: '23505',
    httpStatus: HttpStatus.CONFLICT,
    systemCode: SYSTEM_CODES.ORGANIZATION_SLUG_EXISTS,
    message: 'Organization identifier is unavailable',
  },

  memberships_pkey: {
    pgCode: '23505',
    httpStatus: HttpStatus.CONFLICT,
    systemCode: SYSTEM_CODES.MEMBERSHIP_ALREADY_EXISTS,
    message: 'Membership already exists',
  },
};
