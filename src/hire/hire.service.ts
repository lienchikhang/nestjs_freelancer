import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { CreateHireDto } from 'src/libs/dto';
import { PAYMENT } from 'src/libs/enum';
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

      //check method
      if (method.toLowerCase() != PAYMENT.VNPAY.toLowerCase()) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Payment method not acceptable', method));

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

  async payByAccountBalance(userId: number, { serviceId, method }: CreateHireDto) {
    try {

      if (method.toLowerCase() != PAYMENT.BALANCE.toLowerCase()) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Payment method not acceptable', method));

      //check service exist
      const isExist = await this.prisma.services.findUnique({
        where: {
          id: serviceId,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found!', null));

      //get account balance
      const user = await this.prisma.users.findUnique({
        select: {
          account_balance: true,
        },
        where: {
          id: userId,
        }
      });

      console.log({ user });

      //able to afford?
      if (user.account_balance < isExist.price) {
        throw new BadRequestException(
          this.response.create(
            HttpStatus.BAD_REQUEST,
            'Cannot afford to hire this service due to not having enough money',
            null
          )
        );
      }

      //hire
      const rs = await this.prisma.$transaction([
        this.prisma.hires.create({
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
        }),
        this.prisma.users.update({
          select: {
            account_balance: true,
            full_name: true,
            email: true,
          },
          where: {
            id: userId,
          },
          data: {
            account_balance: user.account_balance - isExist.price
          }
        })
      ])
      // const newHire = await this.prisma.hires.create({
      //   select: {
      //     isDone: true,
      //     id: true,
      //     createdAt: true,
      //     price: true,
      //     Services: {
      //       select: {
      //         service_level: true,
      //         Jobs: {
      //           select: {
      //             job_name: true,
      //             job_image: true,

      //           }
      //         }
      //       }
      //     }
      //   },
      //   data: {
      //     createdAt: new Date(),
      //     price: isExist.price,
      //     user_id: userId,
      //     service_id: serviceId,
      //     method,
      //   },
      // });

      return this.response.create(HttpStatus.CREATED, 'Create successfully!', rs);


    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  //for user checking their hire job
  async findAll(userId: number) {
    try {
      //hire
      const hires = await this.prisma.hires.findMany({
        select: {
          id: true,
          price: true,
          isDone: true,
          user_confirm: true,
          Services: {
            select: {
              id: true,
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

      return this.response.create(HttpStatus.OK, 'Get successfully!', hires);


    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }

  }

  async findAllBySeller(userId: number, page: number = 1, pageSize: number = 6) {

    console.log({ page, pageSize });
    try {
      const jobs = await this.prisma.jobs.findMany({
        select: {
          id: true,
          job_image: true,
          job_name: true,
          job_desc: true,
          sub_id: true,
          Subs: {
            select: {
              ChildTypes: {
                select: {
                  type_id: true,
                  id: true,
                },
              },
              // child_type_id: true,
            }
          },
          Services: {
            select: {
              price: true,
              service_level: true,
              id: true,
              delivery_date: true,
              service_benefit: true,
              service_desc: true,
            }
          }
        },
        where: {
          user_id: userId,
          isDeleted: false,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: {
          id: 'desc',
        }
      },
      );

      const totalJobs = await this.prisma.jobs.count({
        where: {
          user_id: userId,
          isDeleted: false,
        },
      });

      const totalPage = Math.ceil(totalJobs / pageSize);

      return this.response.create(HttpStatus.OK, 'Get successfully!', { jobs, page: totalPage });

    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findOneByUser(userId: number) {
    try {
      const jobs = await this.prisma.jobs.findMany({
        select: {
          id: true,
          job_image: true,
          job_name: true,
          Services: {
            select: {
              price: true,
              service_level: true,
              Hires: {
                select: {
                  isDone: true,
                  Users: {
                    select: {
                      avatar: true,
                      full_name: true,
                    }
                  }
                },
              }
            }
          }
        },
        where: {
          user_id: userId,
        }
      },
      );

      return this.response.create(HttpStatus.OK, 'Get successfully!', jobs);

    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findServiceBySeller(userId: number, serviceId: number) {
    try {

      //check service exist
      const isExist = await this.prisma.services.findUnique({
        where: {
          id: serviceId,
          Jobs: {
            user_id: userId,
          },
          isDeleted: false,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found', null));


      const jobs = await this.prisma.services.findUnique({
        select: {
          id: true,
          service_level: true,
          price: true,
          Hires: {
            select: {
              id: true,
              isDone: true,
              Users: {
                select: {
                  avatar: true,
                  full_name: true,
                }
              }
            },
          }
        },
        where: {
          id: serviceId,
          Jobs: {
            user_id: userId,
          }
        }
      },
      );

      return this.response.create(HttpStatus.OK, 'Get successfully!', jobs);

    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async finishServiceBySeller(sellerId: number, hireId: number) {
    try {
      //check service exist
      const isExist = await this.prisma.services.findFirst({
        where: {
          Hires: {
            some: {
              id: hireId,
            }
          },
          Jobs: {
            user_id: sellerId,
          }
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found', null));

      const rs = await this.prisma.hires.update({
        select: {
          isDone: true,
          Users: {
            select: {
              avatar: true,
              full_name: true,
            }
          }
        },
        where: {
          id: hireId
        },
        data: {
          isDone: true,
        }
      });

      return this.response.create(HttpStatus.OK, 'Service finished', rs);
    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async confirmFinishByUser(userId: number, hireId: number) {
    try {
      //check hired job exist
      const isExist = await this.prisma.hires.findFirst({
        where: {
          id: hireId,
          user_id: userId,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Hired job not found', null));

      //if isDone == true => can confirm
      const isValid = await this.prisma.hires.findUnique({
        where: {
          id: hireId,
          isDone: true,
          user_id: userId,
        }
      });

      if (!isValid) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Cant confirm because Seller hasnt done yet', null));
      //table hires

      const serviceBelongTo = await this.prisma.hires.findFirst({
        select: {
          Services: {
            select: {
              Jobs: {
                select: {
                  Users: {
                    select: {
                      account_balance: true,
                      id: true,
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          id: hireId,
        }
      })

      const rs = await this.prisma.$transaction([
        this.prisma.hires.update({
          select: {
            isDone: true,
            user_confirm: true,
            price: true,
          },
          where: {
            id: hireId,
            user_id: userId,
            isDone: true,
          },
          data: {
            user_confirm: true,
          }
        }),
        this.prisma.users.update({
          select: {
            account_balance: true,
            full_name: true,
            email: true,
          },
          where: {
            id: serviceBelongTo.Services.Jobs.Users.id
          },
          data: {
            account_balance: serviceBelongTo.Services.Jobs.Users.account_balance + isValid.price,
          }
        })
      ]);

      return this.response.create(HttpStatus.OK, 'Confirm successfully!', rs);

    } catch (error) {
      return this.errorHandler.createError(error.status, error.response);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
