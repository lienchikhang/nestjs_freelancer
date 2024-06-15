import { Global, Injectable } from '@nestjs/common';
import { ErrorHandler } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { decode, verify, sign } from 'jsonwebtoken';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import { KeyObject, generateKeyPairSync } from 'crypto';

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
            expiresIn: '2m',
        });
    }

}
