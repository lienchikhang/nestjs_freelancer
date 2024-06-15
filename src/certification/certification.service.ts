import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CertiCreateDto } from 'src/libs/dto/certi.dto';
import ErrorHandlerService from 'src/libs/services/errorhandler.service';
import PrismaService from 'src/libs/services/prisma.service';
import ResponseService from 'src/libs/services/response.service';
import SlugService from 'src/libs/services/slug.service';

@Injectable()
export class CertificationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly slug: SlugService,
        private readonly errorHandler: ErrorHandlerService,
    ) { }

    private async isUserExist(userId: number): Promise<boolean> {
        const isExist = await this.prisma.certifications.findFirst({
            where: {
                user_id: userId,
            }
        });

        if (isExist) return true;
        return false;
    }

    async getAllByUserId(userId: number) {
        try {

            //check user exist
            if (!this.isUserExist(userId)) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'User not found', null));

            //get user's skills
            const certies = await this.prisma.certifications.findMany({
                select: {
                    certi_name: true,
                },
                where: {
                    user_id: userId,
                    isDeleted: false,
                }
            });

            return this.response.create(200, 'Get infomation successfully!', certies);


        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);


        } finally {
            await this.prisma.$disconnect();
        }
    }

    async addOne(userId: number, data: CertiCreateDto) {
        try {

            //check user exist
            if (!this.isUserExist(userId)) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'User not found', null));

            //create skill
            const newCerti = await this.prisma.certifications.create({
                select: {
                    certi_name: true,
                },
                data: {
                    certi_name: this.slug.convert(data.certiName),
                    user_id: userId,
                }
            });

            return this.response.create(201, 'Create successfully!', newCerti)

        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);

        } finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(userId: number, certiId: number) {
        try {

            //check skill exist
            const isExist = await this.prisma.certifications.findUnique({
                where: {
                    id: certiId
                }
            });

            if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Skill not found', null));

            const state = await this.prisma.certifications.update({
                select: {
                    certi_name: true,
                },
                where: {
                    id: certiId,
                    AND: [
                        {
                            user_id: userId,
                        }
                    ]
                },
                data: {
                    isDeleted: true,
                }
            });

            console.log({ state })

            return this.response.create(HttpStatus.OK, 'Delete successfully!', state);

        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);

        } finally {
            await this.prisma.$disconnect();
        }
    }
}
