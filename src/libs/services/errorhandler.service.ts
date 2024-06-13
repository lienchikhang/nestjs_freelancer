import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

@Injectable()
class ErrorHandlerService {
    public createError(type: number, error: any) {
        switch (type) {
            case 500: {
                throw new InternalServerErrorException(error);
            }
            case 400: {
                throw new BadRequestException(error);
            }
            case 404: {
                throw new NotFoundException(error);
            }
        }
    }
}



export default ErrorHandlerService;