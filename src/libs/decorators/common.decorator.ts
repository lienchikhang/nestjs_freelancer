import { UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';
import AuthGuard from '../guards/auth.guard';
import RenewalInterceptor from '../interceptors/renewal.interceptor';

export function Auth() {
    return applyDecorators(
        UseGuards(AuthGuard),
        UseInterceptors(RenewalInterceptor)
    );
}