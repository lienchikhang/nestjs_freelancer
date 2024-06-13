import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
                }
            }
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}

export default PrismaService;