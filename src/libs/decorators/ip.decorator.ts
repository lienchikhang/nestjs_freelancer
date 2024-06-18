import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Ip = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const ip = request.connection.remoteAddress;
        return ip;
    },
);