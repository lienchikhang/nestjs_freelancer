import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CompressService } from 'src/compress/compress.service';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { TypeCreateDto } from 'src/libs/dto/type.dto';
import { MODULE } from 'src/libs/enum';
import { CheckService } from 'src/libs/services/check.service';
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
        private readonly checkService: CheckService,
        private readonly compress: CompressService,
        private readonly cloudinary: CloudinaryService,
    ) {
    }

    async getAllInOne() {
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

            const revertTypes = types.map((type) => {
                const typeName = this.slug.revert(type.type_name);
                const revertChildTypes = type.ChildTypes.map((child) => {
                    const revertSubs = child.Subs.map((sub) => {
                        return {
                            ...sub,
                            sub_name: this.slug.revert(sub.sub_name),
                        }
                    })
                    return {
                        ...child,
                        child_type_name: this.slug.revert(child.child_type_name),
                        Subs: revertSubs
                    }
                })
                return {
                    ...type,
                    ChildTypes: revertChildTypes,
                    type_name: typeName,
                }
            })

            return this.response.create(HttpStatus.OK, 'Get successfully!', revertTypes);

        } catch (error) {
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async getOnlyType() {
        try {

            const types = await this.prisma.types.findMany({
                select: {
                    type_name: true,
                    id: true,
                },
                where: {
                    isDeleted: false,
                }
            });

            const revertTypes = types.map((type) => {
                return {
                    ...type,
                    type_name: this.slug.revert(type.type_name)
                }
            });

            return this.response.create(HttpStatus.OK, 'Get successfully!', revertTypes);

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

    async uploadImage(typeId: number, file: Express.Multer.File) {
        try {
            if (!file) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'No file upload ', null));

            this.checkService.scan(MODULE.TYPE, typeId);

            const originalImageData = file.buffer;

            const compressedImageData = await this.compress.compress(originalImageData, 10, 'png');

            const response = await this.cloudinary.upload(compressedImageData);

            if (response) {
                await this.prisma.types.update({
                    where: {
                        id: typeId,
                    },
                    data: {
                        image: response.url,
                    }
                })
            }
            return this.response.create(HttpStatus.OK, 'Upload successfully!', response);
        } catch (error) {
            console.log({ error })
            return this.errorHandler.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }

    }
}
