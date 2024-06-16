import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { ChildTypeCreateDto } from 'src/libs/dto';
import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class ChildTypeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly slug: SlugService,
        private readonly errorHandler: ErrorHandlerService,
    ) {
    }

    async getAllByTypeId(typeId: number) {
        try {

            let childTypes = await this.prisma.childTypes.findMany({
                select: {
                    child_type_name: true,
                    id: true,
                    Subs: {
                        select: {
                            id: true,
                            sub_name: true,
                        },
                        where: {
                            isDeleted: false,
                        }
                    }
                },
                where: {
                    isDeleted: false,
                    AND: [
                        {
                            type_id: typeId,
                        }
                    ]
                }
            });

            const newChildTypes = childTypes.map((childType) => {
                const revert = this.slug.revert(childType.child_type_name);
                return {
                    ...childType,
                    child_type_name: revert,
                }
            })

            return this.response.create(HttpStatus.OK, 'Get successfully!', newChildTypes);

        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }



    async addOne(userId: number, { childTypeName, typeId }: ChildTypeCreateDto) {
        try {

            //check user exist
            const isExist = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!isExist) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Dont have permission', null));

            //check typeExist
            const isTypeExist = await this.prisma.types.findUnique({
                where: {
                    id: typeId,
                }
            });

            if (!isTypeExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Type not found', null));

            //create new type
            const newType = await this.prisma.childTypes.create({
                select: {
                    id: true,
                    child_type_name: true,
                },
                data: {
                    child_type_name: this.slug.convert(childTypeName),
                    type_id: typeId,
                }
            });

            return this.response.create(HttpStatus.CREATED, 'create successfully', newType);


        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async deleteOne(userId: number, chilTypeId: number) {
        try {

            //check user exist
            const isExist = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!isExist) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Dont have permission', null));

            //check exist type
            const isTypeExist = await this.prisma.childTypes.findUnique({
                where: {
                    id: chilTypeId,
                }
            });

            if (!isTypeExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Child type not found', null));

            const deleteType = await this.prisma.childTypes.update({
                select: {
                    child_type_name: true,
                },
                data: {
                    isDeleted: true,
                },
                where: {
                    id: chilTypeId,
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
