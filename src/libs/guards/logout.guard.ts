import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { TokenService } from "src/token/token.service";

@Injectable()
export class LogoutGuard implements CanActivate {

    constructor(
        private readonly TokenService: TokenService,
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        const token = req.cookies['token'];

        console.log('token', token)

        if (!token) return false;

        const payload = this.TokenService.decode(token);

        req.user = payload;

        return true;
    }

}