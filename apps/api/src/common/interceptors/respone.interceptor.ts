import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  StreamableFile,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


import {
  RESPONSE_META_KEY,
  ResponseMetaOptions,
} from "../decorators/response-meta.decorator";
import { SystemCode } from "../constants/system-codes";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse();

    if (response.statusCode === HttpStatus.NO_CONTENT) {
      return next.handle();
    }

    const metadata =
      this.reflector.getAllAndOverride<ResponseMetaOptions>(
        RESPONSE_META_KEY,
        [context.getHandler(), context.getClass()],
      );

    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        return {
          statusCode: response.statusCode,
          message: metadata?.message ?? "Success",
          systemcode:
            metadata?.system_code ?? SystemCode.SUCCESS,
          ...(data !== undefined ? { data } : {}),
        } satisfies ApiResponse<T>;
      }),
    );
  }
}