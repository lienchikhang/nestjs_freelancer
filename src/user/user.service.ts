import { ConflictException, HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { UserCreateDto, UserUpdateDto } from 'src/libs/dto/user.dto';
import BcryptService from 'src/libs/services/bcrypt.service';

import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly respose: ResponseService,
        private readonly errorHandler: ErrorHandlerService,
        private readonly slug: SlugService,
        private readonly bcrypt: BcryptService,
    ) { }

    async getInfo(userId: number) {
        try {

            const user = await this.prisma.users.findUnique({
                select: {
                    full_name: true,
                    email: true,
                    joinAt: true,
                    avatar: true,
                    Skills: {
                        select: {
                            skill_name: true,
                        },
                        where: {
                            isDeleted: false,
                        }
                    },
                    Certifications: {
                        select: {
                            certi_name: true,
                        },
                        where: {
                            isDeleted: false,
                        }
                    }
                },
                where: {
                    id: userId
                }
            });

            if (!user) throw new NotFoundException(this.respose.create(HttpStatus.NOT_FOUND, 'User not found', null));

            return this.respose.create(HttpStatus.OK, 'Get successfully!', user);

        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async updateInfo(userId: number, { full_name, password }: UserUpdateDto) {

        try {
            let dataNeedUpdate = {}

            //case fullname
            if (full_name) {
                dataNeedUpdate = {
                    ...dataNeedUpdate,
                    full_name: this.slug.convert(full_name)
                }
            }

            //case password
            if (password) {
                dataNeedUpdate = {
                    ...dataNeedUpdate,
                    password: this.bcrypt.encode(password)
                }
            }

            //update
            const userUpdated = await this.prisma.users.update({
                select: {
                    avatar: true,
                    full_name: true,
                    email: true,
                    joinAt: true,
                },
                data: dataNeedUpdate,
                where: {
                    id: userId,
                }
            });

            if (!userUpdated) throw new NotFoundException(this.respose.create(HttpStatus.NOT_FOUND, 'User not found', null));

            return this.respose.create(HttpStatus.OK, 'Update successfully', userUpdated);


        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);

        } finally {
            await this.prisma.$disconnect();
        }

    }

    async active(userId: number) {
        try {
            //check exist
            const isExist = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!isExist) throw new NotFoundException(this.respose.create(HttpStatus.NOT_FOUND, 'User not found', null));

            //update role
            const rs = await this.prisma.users.update({
                where: {
                    id: userId,
                },
                data: {
                    role: 'seller'
                }
            });

            return this.respose.create(HttpStatus.OK, 'Update successfully!', true);


        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
