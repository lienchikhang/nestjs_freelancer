import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ROLE } from "../enum";

@Injectable()
export class RoleAuth implements CanActivate {

    constructor(
        private role: ROLE[],
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest();

        const hasPermission = this.role.includes(req.user.role.toLowerCase());

        console.log({ hasPermission })

        if (!hasPermission) {
            throw new ForbiddenException({
                status: 403,
                mess: 'Dont have permission'
            });
        }

        return this.role.includes(req.user.role.toLowerCase());

    }
}