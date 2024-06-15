import { BadRequestException, CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { verify, decode, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
import { TokenService } from "src/token/token.service";
import { IAuthPayload } from "../interfaces";
import ResponseService from "../services/response.service";
import ErrorHandlerService from "../services/errorhandler.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class AuthGuard implements CanActivate {

    constructor(
        private readonly config: ConfigService,
        private readonly tokenService: TokenService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly errorHandler: ErrorHandlerService,
    ) { }

    async canActivate(context: ExecutionContext) {

        try {
            const request = context.switchToHttp().getRequest();

            const token = request.cookies['token'];

            if (!token) return false;

            const { userId, role, exp } = this.tokenService.decode(token) as IAuthPayload;

            //check login yet
            const isLoggedIn = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                    AND: [
                        {
                            token,
                        }
                    ]
                }
            })

            // if not login yet => 401
            if (!isLoggedIn) throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'Dont have permission', null));

            //verify
            this.tokenService.verify(token);

            request.tokenExp = exp;
            request.user = { userId, role, };

            return true;

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'LoginExpired', null));
            }

            this.errorHandler.createError(error.status, error.respones);
        }

    }
}

export default AuthGuard;