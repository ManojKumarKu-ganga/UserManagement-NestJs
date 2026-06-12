import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const start = Date.now();
        const type = context.getType<string>();

        if (type === 'http') {
            const req = context.switchToHttp().getRequest();
            const res = context.switchToHttp().getResponse();
            const method = req.method;
            const url = req.url;

            this.logger.log(`Incoming request: ${method} ${url}`);

            return next.handle().pipe(
                tap(() => {
                    const ms = Date.now() - start;
                    const status = res?.statusCode ?? '-';
                    this.logger.log(`Request completed: ${method} ${url} - ${status} - ${ms}ms`);
                })
            );
        }

        if (type === 'graphql') {
            const handler = context.getHandler() || 'graphql';
            this.logger.log(`Incoming GraphQL request: ${handler}`);
            return next.handle().pipe(
                tap(() => {
                    const ms = Date.now() - start;
                    this.logger.log(`GraphQL request completed: ${handler} - ${ms}ms`);
                })
            )
        }

        const handler = context.getHandler().name || 'unknown';
        this.logger.log(`Incoming request: ${handler}`)
        return next.handle().pipe(
            tap(() => {
                const ms = Date.now() - start;
                this.logger.log(`Completed ${handler} - ${ms}ms`);
            })
        )
    }
}