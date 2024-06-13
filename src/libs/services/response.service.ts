import { Injectable } from "@nestjs/common";

@Injectable()
class ResponseService {

    private static instance: ResponseService;

    private constructor() { }

    public static getInstance(): ResponseService {
        if (!ResponseService.instance) {
            ResponseService.instance = new ResponseService();
        }

        return ResponseService.instance;
    }

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

export default ResponseService