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
        const isExpiringSoon = expiredTime - currentTime <= 8 * 60 * 1000;

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
            });

            res.cookie('token', newToken, {
                httpOnly: true,
            })
        }

        return next.handle();
    }
}

export default RenewalInterceptor;