import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ErrorHandlerService } from "src/error-handler/error-handler.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseService } from "src/response/response.service";
import { TokenService } from "src/token/token.service";

@Injectable()
export class ValidMiddleware implements NestMiddleware {

    constructor(
        private readonly token: TokenService,
        private readonly response: ResponseService,
        private readonly errorHandler: ErrorHandlerService,
        private readonly prisma: PrismaService,
    ) { }

    async use(req: any, res: any, next: (error?: any) => void) {
        const token = req.cookies['token'];
        console.log('context', token);

        if (!token) throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'Please login to do this action', null));

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

            if (!isLoggedIn) throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'Verify failed', false));

            return this.response.create(HttpStatus.OK, 'Verify successfully!', true);

        } catch (error) {
            // return this.errorHandler.createError(error.status, error.response);
            next()
        }
    }
}