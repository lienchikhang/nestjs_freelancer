import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

class AuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(tap((data) => res.cookie('token', data)));
    }
}

export default AuthInterceptor;