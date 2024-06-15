import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";

@Injectable()
class ErrorHandlerService {

    // constructor(
    //     private readonly errorHandler: ErrorHandlerService,
    // ) {}

    public createError(type: number, error: any) {
        console.log({ error });
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
            case 401: {
                throw new UnauthorizedException(error);
            }
        }
    }
}



export default ErrorHandlerService;