import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
    public create(status: number, mess: string, content: any, options?: any[]) {
        return {
            status,
            mess,
            content,
            ...options,
            date: new Date(),
        }
    }
}
