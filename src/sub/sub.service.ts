import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { SubCreateDto } from 'src/libs/dto';
import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class SubService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly slug: SlugService,
        private readonly errorHandler: ErrorHandlerService,
    ) {
    }

    async getAllByChildTypeId(childTypeId: number) {
        try {

            let subChildTypes = await this.prisma.subs.findMany({
                select: {
                    sub_name: true,
                    id: true,
                },
                where: {
                    isDeleted: false,
                    AND: [
                        {
                            child_type_id: childTypeId,
                        }
                    ]
                }
            });

            const newSubChildTypes = subChildTypes.map((subChildType) => {
                const revert = this.slug.revert(subChildType.sub_name);
                return {
                    ...subChildType,
                    sub_name: revert,
                }
            })

            return this.response.create(HttpStatus.OK, 'Get successfully!', newSubChildTypes);

        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }



    async addOne(userId: number, { subName, childTypeId }: SubCreateDto) {
        try {

            //check user exist
            const isExist = await this.prisma.users.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!isExist) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Dont have permission', null));

            //check typeExist
            const isTypeExist = await this.prisma.childTypes.findUnique({
                where: {
                    id: childTypeId,
                }
            });

            if (!isTypeExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Type not found', null));

            //create new type
            const newType = await this.prisma.subs.create({
                select: {
                    id: true,
                    sub_name: true,
                },
                data: {
                    sub_name: this.slug.convert(subName),
                    child_type_id: childTypeId,
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
