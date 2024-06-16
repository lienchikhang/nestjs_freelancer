import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CompressService } from 'src/compress/compress.service';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { JobCreateDto, JobUpdateDto } from 'src/libs/dto';
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
        private readonly compress: CompressService,
        private readonly cloudinary: CloudinaryService,
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

            const convertTimeJobs = jobs.map((job) => {
                return {
                    ...job,
                    job_name: this.slug.revert(job.job_name)
                }
            })

            const totalJobs = await this.prisma.jobs.count({
                where: defaultConditionCountPage,
            });

            const totalPage = Math.ceil(totalJobs / pageSize);

            return this.response.create(HttpStatus.OK, 'Get successfully!', {
                data: convertTimeJobs,
                page: totalPage,
            });

        } catch (error) {
            return this.errorHanlder.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async getDetail(jobId: number) {
        try {

            //check job exist
            const isExist = await this.prisma.jobs.findUnique({
                select: {
                    id: true,
                    job_name: true,
                    job_desc: true,
                    job_image: true,
                    rate: true,
                    stars: true,
                    Users: {
                        select: {
                            avatar: true,
                            full_name: true,
                        }
                    },
                },
                where: {
                    id: jobId,
                }
            });

            if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

            return this.response.create(HttpStatus.OK, 'Get successfully!', isExist);

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

    async deleteOne(userId: number, jobId: number) {
        try {

            const isExist = await this.prisma.jobs.findUnique({
                where: {
                    id: jobId,
                    AND: [
                        { user_id: userId }
                    ]
                }
            });

            if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found!', null));

            //delete
            const rs = await this.prisma.jobs.update({
                select: {
                    id: true,
                    job_name: true,
                    job_desc: true,
                },
                where: {
                    id: jobId,
                    AND: [
                        { user_id: userId }
                    ]
                },
                data: {
                    isDeleted: true,
                }
            });

            return this.response.create(HttpStatus.OK, 'Delete successfully!', rs);

        } catch (error) {
            return this.errorHanlder.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async update(userId: number, jobId: number, { subId, jobDesc, jobName }: JobUpdateDto) {
        try {

            //check subId exist
            const isSubExist = await this.prisma.subs.findUnique({
                where: {
                    id: subId,
                }
            });

            if (!isSubExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Sub not found', null));

            const isJobExist = await this.prisma.jobs.findUnique({
                where: {
                    id: jobId,
                    isDeleted: false,
                    user_id: jobId,
                }
            });

            if (!isJobExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

            var defaultData = {}

            if (subId) {
                defaultData = {
                    ...defaultData,
                    sub_id: subId,
                }
            }

            if (jobDesc) {
                defaultData = {
                    ...defaultData,
                    job_desc: jobDesc,
                }
            }

            if (jobName) {
                defaultData = {
                    ...defaultData,
                    job_name: this.slug.convert(jobName),
                }
            }

            //update job
            const rs = await this.prisma.jobs.update({
                select: {
                    createdAt: true,
                    job_image: true,
                    job_name: true,
                    job_desc: true,
                },
                data: defaultData,
                where: {
                    id: jobId,
                    AND: [
                        { user_id: userId },
                        { isDeleted: false }
                    ]
                }
            });

            return this.response.create(HttpStatus.OK, 'Update successfully!', rs);

        } catch (error) {
            console.log({ error })
            return this.errorHanlder.createError(error.status, error.response);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async uploadImage(file: Express.Multer.File, jobId: number, userId: number) {
        if (!file) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'No file upload', null));

        //check jobExist
        const isExist = await this.prisma.jobs.findUnique({
            where: {
                id: jobId,
                user_id: userId,
                isDeleted: false,
            }
        });

        if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

        const originalImageData = file.buffer;

        const compressedImageData = await this.compress.compress(originalImageData, 10);

        const response = await this.cloudinary.upload(compressedImageData);

        //update job
        if (response) {
            await this.prisma.jobs.update({
                data: {
                    job_image: response?.url,
                },
                where: {
                    id: jobId,
                    AND: [
                        { user_id: userId },
                        { isDeleted: false }
                    ]
                }
            })
        }

        return this.response.create(HttpStatus.OK, 'Upload successfully!', response)
    }

}
