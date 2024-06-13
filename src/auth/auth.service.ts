import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { UserCreateDto } from 'src/libs/dto/user.dto';
import BcryptService from 'src/libs/services/bcrypt.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import PrismaService from 'src/libs/services/prisma.service';
import ResponseService from 'src/libs/services/response.service';
import SlugService from 'src/libs/services/slug.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slug: SlugService,
        private readonly response: ResponseService,
        private readonly bcrypt: BcryptService,
        private readonly errorHandler: ErrorHandlerService,
    ) { }

    async register(data: UserCreateDto) {
        try {

            //check email exist
            const isExist = await this.prisma.users.findFirst({
                where: {
                    email: data.email,
                }
            });

            if (isExist) throw new ConflictException(this.response.create(HttpStatus.CONFLICT, 'Email has already existed', data.email));

            //hash password
            const hashPass = this.bcrypt.encode(data.password);

            //convert name to slug
            const slugName = this.slug.convert(data.fullName);

            //create new user
            const newUser = await this.prisma.users.create({
                select: {
                    email: true,
                    full_name: true,
                    avatar: true,
                },
                data: {
                    email: data.email,
                    password: hashPass,
                    full_name: slugName,
                    joinAt: new Date(),
                }
            });

            return this.response.create(HttpStatus.OK, 'Register successfully', newUser);


        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
