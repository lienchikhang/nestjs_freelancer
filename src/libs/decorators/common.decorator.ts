import { UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';
import RenewalInterceptor from '../interceptors/renewal.interceptor';
import MyAuthGuard from '../guards/auth.guard';

export function Auth() {
    return applyDecorators(
        UseGuards(MyAuthGuard),
        UseInterceptors(RenewalInterceptor)
    );
}