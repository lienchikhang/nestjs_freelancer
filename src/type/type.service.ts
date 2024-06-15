import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { TypeCreateDto } from 'src/libs/dto/type.dto';
import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class TypeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly slug: SlugService,
        private readonly errorHandler: ErrorHandlerService,
    ) {
    }

    async getAll() {
        try {

            const types = await this.prisma.types.findMany({
                select: {
                    type_name: true,
                    id: true,
                    ChildTypes: {
                        select: {
                            child_type_name: true,
                            id: true,
                            Subs: {
                                select: {
                                    sub_name: true,
                                    id: true,
                                },
                                where: {
                                    isDeleted: false,
                                }
                            }
                        },
                        where: {
                            isDeleted: false,
                        }
                    }
                },
                where: {
                    isDeleted: false,
                }
            });

            return this.response.create(HttpStatus.OK, 'Get successfully!', types);

        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async addOne(userId: number, { typeName }: TypeCreateDto) {
        try {

            //check user exist
            const isExist = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!isExist) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Dont have permission', null));

            //create new type
            const newType = await this.prisma.types.create({
                select: {
                    id: true,
                    type_name: true,
                },
                data: {
                    type_name: this.slug.convert(typeName)
                }
            });

            return this.response.create(HttpStatus.CREATED, 'create successfully', newType);


        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async deleteOne(userId: number, typeId: number) {
        try {

            //check user exist
            const isExist = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!isExist) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Dont have permission', null));

            //check exist type
            const isTypeExist = await this.prisma.types.findUnique({
                where: {
                    id: typeId,
                }
            });

            if (!isTypeExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Type not found', null));

            const deleteType = await this.prisma.types.update({
                select: {
                    type_name: true,
                },
                data: {
                    isDeleted: true,
                },
                where: {
                    id: typeId,
                }
            });



            return this.response.create(HttpStatus.OK, 'Delete successfully!', deleteType)

        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
