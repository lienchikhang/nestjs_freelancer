import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto, UserLoginDto } from 'src/libs/dto/user.dto';
import BcryptService from 'src/libs/services/bcrypt.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import PrismaService from 'src/libs/services/prisma.service';
import ResponseService from 'src/libs/services/response.service';
import SlugService from 'src/libs/services/slug.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slug: SlugService,
        private readonly response: ResponseService,
        private readonly bcrypt: BcryptService,
        private readonly errorHandler: ErrorHandlerService,
        private readonly token: TokenService,
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

    async login({ email, password }: UserLoginDto) {
        try {

            //check email exist
            const isExist = await this.prisma.users.findFirst({
                where: {
                    email: email
                }
            });

            if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'User not found', null));

            //check password
            const isValidPass = this.bcrypt.compare(isExist.password, password);

            if (!isValidPass) throw new BadRequestException(this.response.create(HttpStatus.BAD_GATEWAY, 'Email or password is wrong', null));

            //create token
            const token = this.token.sign({
                userId: isExist.id,
                role: isExist.role
            });

            return this.response.create(HttpStatus.OK, 'Login successfully!', token);

        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);

        } finally {
            await this.prisma.$disconnect();
        }
    }
}