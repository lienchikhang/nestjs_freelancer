import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillModule } from './skill/skill.module';
import { CertificationModule } from './certification/certification.module';
import { UserModule } from './user/user.module';
import { TypeModule } from './type/type.module';
import { ChildTypeModule } from './child-type/child-type.module';
import { SubModule } from './sub/sub.module';
import { JobModule } from './job/job.module';
import { ServiceModule } from './service/service.module';
import { CommentModule } from './comment/comment.module';
import { RateModule } from './rate/rate.module';
import { HireModule } from './hire/hire.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { PrismaModule } from './prisma/prisma.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { ResponseModule } from './response/response.module';
import { CompressModule } from './compress/compress.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

    }),
    SkillModule,
    CertificationModule,
    UserModule,
    TypeModule,
    ChildTypeModule,
    SubModule,
    JobModule,
    ServiceModule,
    CommentModule,
    RateModule,
    HireModule,
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    TokenModule,
    PrismaModule,
    ErrorHandlerModule,
    ResponseModule,
    CompressModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
