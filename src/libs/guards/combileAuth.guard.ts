import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { TokenService } from "src/token/token.service";
import { IAuthPayload } from "../interfaces";
import { ResponseService } from "src/response/response.service";

@Injectable()
export class CombileGuard extends AuthGuard('facebook') {
    constructor(
        private readonly tokenService: TokenService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
    ) {
        super()
    }

    canActivate(context: ExecutionContext) {
        // Sử dụng các guards được định nghĩa trong AuthGuard (['jwt', 'facebook'])
        const request = context.switchToHttp().getRequest();
        const cookieAuthResult = this.cookieAuth(request);
        if (cookieAuthResult) {
            return true;
        }
        return super.canActivate(context);
    }

    async cookieAuth(request: any): Promise<boolean> {
        // Logic xác thực bằng cookie
        const cookie = request.cookies['token'];
        if (cookie) {
            // Kiểm tra giá trị của cookie, ví dụ: giải mã và xác thực token
            //verify
            this.tokenService.verify(cookie);

            const { userId, role, exp } = this.tokenService.decode(cookie) as IAuthPayload;

            //check login yet
            const isLoggedIn = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                    AND: [
                        {
                            token: cookie,
                        }
                    ]
                }
            })

            // if not login yet => 401
            if (!isLoggedIn) throw new UnauthorizedException(this.response.create(HttpStatus.UNAUTHORIZED, 'Dont have permission', null));

            request.tokenExp = exp;
            request.user = { userId, role, };

            return true; // Trả về true nếu cookie hợp lệ
        }
        return false;
    }

    handleRequest(err, user, info, context) {
        // Nếu đã xác thực bằng cookie, bỏ qua Passport Facebook
        if (this.cookieAuth(context.switchToHttp().getRequest())) {
            return true;
        }
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}