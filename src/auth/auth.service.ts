import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { generateKeyPairSync } from 'crypto';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { ICheckValid, UserCreateDto, UserLoginDto } from 'src/libs/dto/user.dto';
import BcryptService from 'src/libs/services/bcrypt.service';
import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';
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
        private readonly config: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async register({ email, fullName, password, otp }: UserCreateDto) {
        try {

            //check email exist
            const isExist = await this.prisma.users.findFirst({
                where: {
                    email,
                }
            });

            if (isExist) throw new ConflictException(this.response.create(HttpStatus.CONFLICT, 'Email has already existed', email));

            //verify OTP
            const verifyOtp = await this.cacheManager.get(email.trim());
            console.log('verifyOTP', verifyOtp);
            if (!verifyOtp) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'OTP has expired!', otp))
            if (verifyOtp != otp) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'OTP is not correct!', otp));

            //hash password
            const hashPass = this.bcrypt.encode(password);

            //convert name to slug
            const slugName = this.slug.convert(fullName);

            //create new user
            const newUser = await this.prisma.users.create({
                select: {
                    email: true,
                    full_name: true,
                    avatar: true,
                },
                data: {
                    email: email,
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

            if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Email or password is wrong', null));

            //check password
            const isValidPass = this.bcrypt.compare(isExist.password, password);

            if (!isValidPass) throw new BadRequestException(this.response.create(HttpStatus.BAD_GATEWAY, 'Email or password is wrong', null));

            //create token
            const token = this.token.sign({
                userId: isExist.id,
                role: isExist.role
            });

            //save token
            await this.prisma.users.update({
                data: {
                    token,
                },
                where: {
                    id: isExist.id,
                }
            });

            return this.response.create(HttpStatus.OK, 'Login successfully!', {
                token: token,
                user: {
                    full_name: isExist.full_name,
                    avatar: isExist.avatar,
                    email: isExist.email,
                }
            });

        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);

        } finally {
            await this.prisma.$disconnect();
        }
    }

    async logout(userId: number) {
        try {
            const rs = await this.prisma.users.update({
                data: {
                    token: null,
                },
                where: {
                    id: userId,
                }
            });

            return this.response.create(HttpStatus.OK, 'Logout successfully!', null);
        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async check({ value }: ICheckValid) {

        try {
            this.token.verify(value);

            const payload = this.token.decode(value) as {
                userId: number,
            };

            const isLoggedIn = await this.prisma.users.findFirst({
                where: {
                    id: payload.userId,
                    token: value,
                }
            });

            if (!isLoggedIn) return false;

            return true;

        } catch (error) {
            console.log('error in tokenauth', error);
            return false;
        }

    }
}
