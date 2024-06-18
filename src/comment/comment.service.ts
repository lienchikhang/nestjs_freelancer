import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { CreateCommentDto } from 'src/libs/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';


@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly response: ResponseService,
  ) { }

  async create(jobId: number, userId: number, { content, rateNum }: CreateCommentDto) {
    try {

      //check job exist
      const isJobExist = await this.prisma.jobs.findUnique({
        where: {
          id: jobId,
        }
      });

      if (!isJobExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

      //check hasComment yet
      const hasCommented = await this.prisma.comments.findFirst({
        where: {
          job_id: jobId,
          user_id: userId,
        }
      });

      if (hasCommented) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'You have already commented ', null));

      //count total comment in job
      const totalComment = await this.prisma.comments.count({
        where: {
          job_id: jobId,
        },
      });

      const totalRate = await this.prisma.comments.aggregate({
        _sum: {
          rate: true,
        }
      });


      const rs = await this.prisma.$transaction([
        this.prisma.comments.create({
          select: {
            content: true,
            createdAt: true,
            rate: true,
            Users: {
              select: {
                avatar: true,
                full_name: true,
              }
            }
          },
          data: {
            content,
            createdAt: new Date(),
            user_id: userId,
            job_id: jobId,
            rate: rateNum,
          },
        }),
        this.prisma.jobs.update({
          select: {
            rate: true,
            stars: true,
          },
          data: {
            rate: {
              increment: 1,
            },
            stars: {
              set: Math.floor(totalRate._sum.rate / totalComment)
            }
          },
          where: {
            id: jobId,
          }
        })
      ])

      return this.response.create(HttpStatus.CREATED, 'Add successfully!', rs);


    } catch (error) {
      console.log({ error });
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findAll(jobId: number, page: number = 1, pageSize: number = 5) {
    try {

      //check job exist
      const isJobExist = await this.prisma.jobs.findUnique({
        where: {
          id: jobId,
        }
      });

      if (!isJobExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

      const comments = await this.prisma.comments.findMany({
        select: {
          content: true,
          rate: true,
          Users: {
            select: {
              avatar: true,
              full_name: true,
            }
          },
          createdAt: true,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      const totalComment = await this.prisma.comments.count({
        where: {
          job_id: jobId,
        }
      });

      const totalPage = Math.ceil(totalComment / pageSize);

      return this.response.create(HttpStatus.OK, 'Get successfully!', {
        data: comments,
        page: totalPage,
      })

    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

}
