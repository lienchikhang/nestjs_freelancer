import { BadRequestException, CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { verify, decode, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
import { TokenService } from "src/token/token.service";
import { IAuthPayload } from "../interfaces";

import { PrismaService } from "src/prisma/prisma.service";
import { ResponseService } from "src/response/response.service";
import { ErrorHandlerService } from "src/error-handler/error-handler.service";

@Injectable()
class MyAuthGuard implements CanActivate {

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

            if (!token) throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'Please login to do this action', null));

            //verify
            this.tokenService.verify(token);

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

            request.tokenExp = exp;
            request.user = { userId, role, };

            return true;

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'LoginExpired', null));
            }

            console.log('error in auth', error);
            this.errorHandler.createError(error.status, error.response);
        }

    }
}

export default MyAuthGuard;