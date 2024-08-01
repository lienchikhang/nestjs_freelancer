import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { CreateServiceDto, UpdateServiceDto } from 'src/libs/dto';
import SlugService from 'src/libs/services/slug.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';


@Injectable()
export class ServiceService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly slug: SlugService,
    private readonly response: ResponseService,
    private readonly errorHanlder: ErrorHandlerService,
  ) { }

  async create(userId: number, jobId: number, { deliveryDate, price, serviceBenefit, serviceDesc, serviceLevel }: CreateServiceDto) {

    try {

      //check job exist
      const isExists = await this.prisma.jobs.findUnique({
        where: {
          id: jobId,
          isDeleted: false,
          user_id: userId,
        }
      });

      if (!isExists) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

      //check is maxium service (maxium = 3)
      const isMaxium = await this.prisma.services.count({
        where: {
          Jobs: {
            id: isExists.id,
          },
          isDeleted: false,
        }
      });

      console.log({ isMaxium });

      if (isMaxium === 3) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Reach maxium services', null));

      //create
      const newService = await this.prisma.services.create({
        select: {
          id: true,
          price: true,
          service_benefit: true,
          service_desc: true,
          service_level: true,
        },
        data: {
          delivery_date: deliveryDate,
          price,
          service_benefit: serviceBenefit,
          service_desc: serviceDesc,
          service_level: serviceLevel.toUpperCase(),
          job_id: jobId,
        }
      });

      return this.response.create(HttpStatus.CREATED, 'Create successfull!', newService);

    } catch (error) {
      return this.errorHanlder.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findAll(jobId: number) {
    try {
      //check exist job
      const isExist = await this.prisma.jobs.findUnique({
        where: {
          id: jobId,
          isDeleted: false,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));

      //get services
      const services = await this.prisma.services.findMany({
        select: {
          id: true,
          service_desc: true,
          price: true,
          service_benefit: true,
          service_level: true,
          delivery_date: true,
        },
        where: {
          job_id: isExist.id,
          isDeleted: false,
        }
      });

      return this.response.create(HttpStatus.OK, 'Get successfull!', services);

    } catch (error) {
      return this.errorHanlder.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findAllBySeller(userId: number, page: number = 1, pageSize: number = 6) {
    try {

      //get services
      const services = await this.prisma.services.findMany({
        select: {
          id: true,
          price: true,
          service_level: true,
          Jobs: {
            select: {
              job_name: true,
              job_image: true,
            }
          }
        },
        where: {
          Jobs: {
            user_id: userId,
          },
          isDeleted: false,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      const totalService = await this.prisma.services.count({
        where: {
          Jobs: {
            user_id: userId,
          },
          isDeleted: false,
        },
      });

      const totalPage = Math.ceil(totalService / pageSize);

      return this.response.create(HttpStatus.OK, 'Get successfull!', { services, page: totalPage });

    } catch (error) {
      return this.errorHanlder.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }


  async update(id: number, userId, { deliveryDate, price, serviceBenefit, serviceDesc, serviceLevel }: UpdateServiceDto) {
    try {

      //check service exist
      const isExist = await this.prisma.services.findUnique({
        where: {
          id,
          Jobs: {
            user_id: userId,
          },
          isDeleted: false,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found', null));

      //update
      var dataUpdate = {};

      //case price
      if (price) {
        dataUpdate = {
          ...dataUpdate,
          price,
        }
      }

      //case deliveryDate
      if (deliveryDate) {
        dataUpdate = {
          ...dataUpdate,
          delivery_date: deliveryDate,
        }
      }

      //case serviceBenefit
      if (serviceBenefit) {
        dataUpdate = {
          ...dataUpdate,
          service_benefit: serviceBenefit,
        }
      }

      //case serviceDesc
      if (serviceDesc) {
        dataUpdate = {
          ...dataUpdate,
          service_desc: serviceDesc,
        }
      }

      //case serviceLevel
      if (serviceLevel) {
        dataUpdate = {
          ...dataUpdate,
          service_level: serviceLevel,
        }
      }

      const updatedService = await this.prisma.services.update({
        select: {
          id: true,
          delivery_date: true,
          price: true,
          service_benefit: true,
          service_level: true,
          service_desc: true,
        },
        data: dataUpdate,
        where: {
          id: id,

        }
      });

      return this.response.create(HttpStatus.OK, 'Update successfully', updatedService);

    } catch (error) {
      return this.errorHanlder.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async remove(id: number, userId: number) {
    try {
      //check service exist
      const isExist = await this.prisma.services.findUnique({
        where: {
          id,
          Jobs: {
            user_id: userId,
          }
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found', null));

      //delete
      const deletedService = await this.prisma.services.update({
        select: {
          id: true,
          delivery_date: true,
          price: true,
          service_benefit: true,
          service_level: true,
          service_desc: true,
        },
        where: {
          id,
        },
        data: {
          isDeleted: true,
        }
      });

      return this.response.create(HttpStatus.OK, 'Delete successfully', deletedService);
    } catch (error) {
      return this.errorHanlder.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
