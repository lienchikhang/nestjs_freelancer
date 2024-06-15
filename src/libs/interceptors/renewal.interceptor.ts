import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { TokenService } from "src/token/token.service";

@Injectable()
class RenewalInterceptor implements NestInterceptor {

    constructor(
        private readonly tokenService: TokenService,
        private readonly prisma: PrismaService,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {

        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const exp = req.tokenExp;
        const user = req.user;

        //check expired soon
        const currentTime = Date.now();
        const expiredTime = exp * 1000;
        const rs = expiredTime - currentTime;
        const isExpiringSoon = expiredTime - currentTime <= 1 * 60 * 1000;

        // const isExpiringSoon = timeLeft <= fiveMinites;


        console.log({ currentTime, expiredTime, isExpiringSoon, user });

        if (isExpiringSoon) {
            const newToken = this.tokenService.sign(req.user);

            console.log({ newToken });

            await this.prisma.users.update({
                where: {
                    id: user.userId
                },
                data: {
                    token: newToken,
                }
            })

            return next.handle().pipe(tap((data) => res.cookie('token', newToken, {
                httpOnly: true,
            })))
        }

        return next.handle().pipe(tap((data) => data))

    }

}

export default RenewalInterceptor;