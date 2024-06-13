import { Injectable } from "@nestjs/common";

@Injectable()
class ResponseService {

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