import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>(); // ✅ sudah bertipe Response

    return next.handle().pipe(
      map(
        (
          data: T,
        ): {
          statusCode: number;
          message: string;
          data: T;
        } => {
          const statusCode = res.statusCode;
          const message =
            (res.locals?.message as string | undefined) ?? 'success';

          return {
            statusCode,
            message,
            data,
          };
        },
      ),
    );
  }
}
