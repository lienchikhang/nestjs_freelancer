import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { decode, verify, sign } from 'jsonwebtoken';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';

@Injectable()
export class TokenService {

    constructor(
        private readonly config: ConfigService,
        private readonly errorHandler: ErrorHandlerService,
    ) { }

    public verify(token: string) {
        try {
            verify(token, this.config.get('PUBLIC_KEY'))
        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        }
    }

    public decode(token: string) {
        return decode(token);
    }

    public sign(payload: any): string {
        return sign(payload, this.config.get('PUBLIC_KEY'), {
            expiresIn: '15m'
        });
    }

}
