import { ConflictException, HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto, UserUpdateDto } from 'src/libs/dto/user.dto';
import BcryptService from 'src/libs/services/bcrypt.service';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import PrismaService from 'src/libs/services/prisma.service';
import ResponseService from 'src/libs/services/response.service';
import SlugService from 'src/libs/services/slug.service';

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

    async updateInfo(userId: number, { full_name, birth_day, gender, password, phone }: UserUpdateDto) {

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

            //case gender
            if (gender) {
                dataNeedUpdate = {
                    ...dataNeedUpdate,
                    gender,
                }
            }

            //case phone
            if (phone) {
                dataNeedUpdate = {
                    ...dataNeedUpdate,
                    phone,
                }
            }

            //case birthday
            if (birth_day) {
                dataNeedUpdate = {
                    ...dataNeedUpdate,
                    birth_day,
                }
            }

            //update
            const userUpdated = await this.prisma.users.update({
                select: {
                    avatar: true,
                    full_name: true,
                    gender: true,
                    email: true,
                    joinAt: true,
                    phone: true,
                    birth_day: true,
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
}
