import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseService } from "src/response/response.service";
import { MODULE } from "../enum";

@Injectable()
export class CheckService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
    ) { }

    public scan(module: MODULE, id: number) {
        switch (module) {
            case MODULE.JOB: {
                this.isJobExist(id)
            }
            case MODULE.SKILL: {
                this.isTypeExist(id)
            }
            case MODULE.USER: {
                this.isUserExist(id)
            }
        }
    }

    public async isUserExist(userId: number): Promise<boolean> {
        const isExist = await this.prisma.users.findUnique({
            where: {
                id: userId,
            }
        });

        if (isExist) return true;
        throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'User not found', null));
    }

    private async isTypeExist(typeId: number): Promise<boolean> {
        const isExist = await this.prisma.types.findUnique({
            where: {
                id: typeId,
            }
        });

        if (isExist) return true;
        throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Type not found', null));
    }

    private async isJobExist(jobId: number): Promise<boolean> {
        const isExist = await this.prisma.jobs.findUnique({
            where: {
                id: jobId,
            }
        });

        if (isExist) return true;
        throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Job not found', null));
    }
}
