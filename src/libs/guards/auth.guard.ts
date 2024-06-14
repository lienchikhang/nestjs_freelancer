import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { verify, decode } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

class AuthGuard implements CanActivate {

    constructor(
        private readonly config: ConfigService,
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        try {
            const request = context.switchToHttp().getRequest();

            verify(request.cookie, this.config.get('PUBLIC_KEY'));

            return true;
        } catch (error) {
            return false;
        }

    }
}

export default AuthGuard;