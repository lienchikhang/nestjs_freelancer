import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { JobCreateDto } from 'src/libs/dto';
import { IJobOrder, IJobsCondition, IJobsPageCondition } from 'src/libs/interfaces';
import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class JobService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly slug: SlugService,
        private readonly response: ResponseService,
        private readonly errorHanlder: ErrorHandlerService,
    ) { }

    async getAll(
        page: number = 1,
        pageSize: number = 16,
        name: string = '',
        sub: number,
        orderBy: string = '',
        sort: string = 'asc',
    ) {
        try {

            console.log({ page, pageSize, name, sub, orderBy, sort })

            var defaultCondition = {
                isDeleted: false,
            } as IJobsCondition;

            var defaultConditionCountPage = {
                isDeleted: false,
            } as IJobsPageCondition;

            // var defaultOrder = {
            //     id: sort as 'asc' | 'desc'
            // } as IJobOrder

            if (name) {
                defaultCondition = {
                    ...defaultCondition,
                    job_name: {
                        contains: name,
                    }
                }

                defaultConditionCountPage = {
                    ...defaultConditionCountPage,
                    job_name: {
                        contains: name,
                    },
                }
            }

            if (sub) {
                defaultCondition = {
                    ...defaultCondition,
                    AND: [
                        {
                            sub_id: sub,
                        }
                    ]
                };

                defaultConditionCountPage = {
                    ...defaultConditionCountPage,
                    AND: [
                        {
                            sub_id: sub,
                        }
                    ]
                }
            }

            // if (orderBy) {
            //     defaultOrder = {
            //         [orderBy]: sort as 'asc' | 'desc'
            //     } as IJobOrder
            //     console.log({ defaultOrder });
            // }

            const jobs = await this.prisma.jobs.findMany({
                select: {
                    id: true,
                    job_name: true,
                    job_image: true,
                    rate: true,
                    createdAt: true,
                    stars: true,
                    Services: {
                        select: {
                            price: true,
                        },
                        where: {
                            service_level: {
                                equals: 'BASIC'
                            }
                        }
                    }
                },
                where: defaultCondition,
                take: pageSize,
                skip: (page - 1) * pageSize,
                orderBy: orderBy ? {
                    [orderBy]: sort as 'asc' | 'desc'
                } : {
                    id: sort as 'asc' | 'desc'
                },
            });

            // const convertTimeJobs = jobs.map((job) => {
            //     return {
            //         ...job,
            //         createdAt: new Date(job.createdAt * 1000),
            //     }
            // })

            const totalJobs = await this.prisma.jobs.count({
                where: defaultConditionCountPage,
            });

            const totalPage = Math.ceil(totalJobs / pageSize);

            return this.response.create(HttpStatus.OK, 'Get successfully!', {
                data: jobs,
                page: totalPage,
            });

        } catch (error) {
            return this.errorHanlder.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async addOne(userId: number, { jobName, jobDesc, subId }: JobCreateDto) {
        try {

            //check subId exist
            const isSubExist = await this.prisma.subs.findUnique({
                where: {
                    id: subId,
                }
            });

            if (!isSubExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Sub not found', null));

            //create new job

            const allJobs = await this.prisma.jobs.findMany({
                select: {
                    id: true,
                },
                orderBy: {
                    id: 'asc',
                },
            });

            let newJobId = 1;
            for (let i = 0; i < allJobs.length; i++) {
                if (allJobs[i].id != newJobId) {
                    break;
                }
                newJobId++;
            }

            console.log({ newJobId });

            const newJob = await this.prisma.jobs.create({
                select: {
                    createdAt: true,
                    job_image: true,
                    job_name: true,
                    job_desc: true,
                },
                data: {
                    id: newJobId,
                    job_name: this.slug.convert(jobName),
                    job_desc: jobDesc,
                    sub_id: subId,
                    user_id: userId,
                    createdAt: new Date(),
                },
            });

            return this.response.create(HttpStatus.CREATED, 'Create successfully!', newJob);

        } catch (error) {
            console.log({ error })
            return this.errorHanlder.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
