import { NestMiddleware } from "@nestjs/common";

export class FacebookMiddleware implements NestMiddleware {
    use(req: any, res: any, next: (error?: any) => void) {

        const token = 'dawd';

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax'
        });

        next();

    }

}