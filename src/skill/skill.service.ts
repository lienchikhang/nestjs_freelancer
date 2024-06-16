import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { SkillCreateDto } from 'src/libs/dto/skill.dto';
import { MODULE } from 'src/libs/enum';
import { CheckService } from 'src/libs/services/check.service';

import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class SkillService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly slug: SlugService,
        private readonly errorHandler: ErrorHandlerService,
        private readonly checkService: CheckService,
    ) { }

    async getAllByUserId(userId: number) {
        try {

            //check user exist
            this.checkService.scan(MODULE.USER, userId);

            //get user's skills
            const skills = await this.prisma.skills.findMany({
                select: {
                    skill_name: true,
                },
                where: {
                    user_id: userId,
                }
            });

            return this.response.create(200, 'Get infomation successfully!', skills);


        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);


        } finally {
            await this.prisma.$disconnect();
        }
    }

    async addOne(userId: number, data: SkillCreateDto) {
        try {

            //check user exist
            this.checkService.scan(MODULE.USER, userId);

            //create skill
            const newSkill = await this.prisma.skills.create({
                select: {
                    skill_name: true,
                },
                data: {
                    skill_name: this.slug.convert(data.skillName),
                    user_id: userId,
                }
            });

            return this.response.create(201, 'Create successfully!', newSkill)

        } catch (error) {

            return this.errorHandler.createError(error.status, error.response);

        } finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(userId: number, skillId: number) {
        try {

            //check skill exist
            const isExist = await this.prisma.skills.findUnique({
                where: {
                    id: skillId
                }
            });

            if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Skill not found', null));

            const state = await this.prisma.skills.update({
                select: {
                    skill_name: true,
                },
                where: {
                    id: skillId,
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
