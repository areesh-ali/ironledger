import { HttpException } from '@nestjs/common';
import type { SystemCode } from '../constants/system-codes';

export class AppException extends HttpException {
  constructor(
    statusCode: number,
    message: string,
    systemCode: SystemCode,
    data?: unknown,
  ) {
    super(
      {
        message,
        system_code: systemCode,
        ...(data !== undefined ? { data } : {}),
      },
      statusCode,
    );
  }
}
