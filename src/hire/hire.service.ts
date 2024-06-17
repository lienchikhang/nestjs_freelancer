import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { CreateHireDto } from 'src/libs/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class HireService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
    private readonly errorHandler: ErrorHandlerService,
  ) { }

  async create(userId: number, { serviceId, method }: CreateHireDto) {
    try {

      //check service exist
      const isExist = await this.prisma.services.findUnique({
        where: {
          id: serviceId,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found!', null));

      //hire
      const newHire = await this.prisma.hires.create({
        select: {
          isDone: true,
          id: true,
          createdAt: true,
          price: true,
          Services: {
            select: {
              service_level: true,
              Jobs: {
                select: {
                  job_name: true,
                  job_image: true,

                }
              }
            }
          }
        },
        data: {
          createdAt: new Date(),
          price: isExist.price,
          user_id: userId,
          service_id: serviceId,
          method,
        },
      });

      return this.response.create(HttpStatus.CREATED, 'Create successfully!', newHire);


    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findAll(userId: number) {
    try {
      //hire
      const newHire = await this.prisma.hires.findMany({
        select: {
          isDone: true,
          id: true,
          createdAt: true,
          price: true,
          Services: {
            select: {
              service_level: true,
              Jobs: {
                select: {
                  job_name: true,
                  job_image: true,
                }
              }
            }
          }
        },
        where: {
          user_id: userId,
        }
      });

      return this.response.create(HttpStatus.CREATED, 'Create successfully!', newHire);


    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} hire`;
  }

  remove(id: number) {
    return `This action removes a #${id} hire`;
  }

}
