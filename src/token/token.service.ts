import { Global, Injectable } from '@nestjs/common';
import { ErrorHandler } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { decode, verify, sign } from 'jsonwebtoken';
import { KeyObject, generateKeyPairSync } from 'crypto';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';

@Injectable()
export class TokenService {


    constructor(
        private readonly config: ConfigService,
        private readonly errorHandler: ErrorHandlerService,
    ) {
    }

    public verify(token: string) {
        return verify(token, process.env.PUBLIC_KEY);
    }

    public decode(token: string) {
        return decode(token);
    }

    public sign(payload: any): string {
        return sign(payload, process.env.PUBLIC_KEY, {
            expiresIn: '15m',
        });
    }

}
