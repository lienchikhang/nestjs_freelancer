import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { TokenService } from "src/token/token.service";

@Injectable()
export class TokenGuard implements CanActivate {

    constructor(
        private readonly token: TokenService,
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        console.log('req in tokenGuard', req)


        const token = req.cookies['token'];

        console.log('token in tokenGuard', token)

        try {
            this.token.verify(token);

            const payload = this.token.decode(token) as {
                userId: number,
            };

            const isLoggedIn = await this.prisma.users.findFirst({
                where: {
                    id: payload.userId,
                    token: token,
                }
            });

            if (!isLoggedIn) return false;

            return true;
        } catch (error) {
            console.log('error in tokenauth', error);
            return false;
        }
    }
}