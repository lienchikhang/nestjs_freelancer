import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class FacebookInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(tap((data) => {
            console.log('before return facebook', req.user);
            res.cookie('token', req.user.content.accessToken, {
                httpOnly: true,
            })
            return null;
        }));
    }

}