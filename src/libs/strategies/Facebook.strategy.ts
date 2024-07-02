import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseService } from "src/response/response.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
    ) {
        super({
            clientID: 488606110308010,
            clientSecret: '0ce9f329e97cc82c2c0e93d4b0029596',
            callbackURL: "http://localhost:8080/auth/facebook/redirect",
            scope: "email",
            profileFields: ["emails", "name"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        console.log('profile in facebook', profile);
        console.log('token in facebook', { accessToken });
        const { name, emails, id } = profile;

        //check user exist
        const isExist = await this.prisma.users.findFirst({
            where: {
                email: emails[0].value,
                facebook_app_id: id,
            }
        });

        if (!isExist) {
            await this.prisma.users.create({
                data: {
                    email: emails[0].value,
                    full_name: name.givenName + name.familyName,
                    token: accessToken,
                    password: id,
                    joinAt: new Date(),
                    facebook_app_id: id,
                    avatar: profile.profileUrl,
                }
            })
        }

        const info = {
            email: emails[0].value,
            name: name.givenName + name.familyName,
            avatar: profile.profileUrl,
        };

        const payload = this.response.create(HttpStatus.OK, 'Login successfully!', { info, accessToken })

        done(null, payload);
    }
}