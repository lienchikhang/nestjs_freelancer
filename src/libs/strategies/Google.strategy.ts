import { ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseService } from "src/response/response.service";
import { TokenService } from "src/token/token.service";

@Injectable()
export class GoogleStategy extends PassportStrategy(Strategy, "google") {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly response: ResponseService,
        private readonly token: TokenService,
    ) {
        super({
            clientID: config.get('GOOGLE_CLIENT_ID'),
            clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: "http://localhost:8080/auth/google/redirect",
            scope: ["email", "profile"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        console.log('profile in google', profile);
        const { displayName, emails, id, } = profile;

        //check user exist
        const isExist = await this.prisma.users.findFirst({
            where: {
                email: emails[0].value,
                google_app_id: id,
            }
        });

        //con bi null trong truong hop lan dau vao app
        console.log('exist gg', isExist)

        if (!isExist) {

            const user = await this.prisma.users.create({
                select: {
                    full_name: true,
                    email: true,
                    avatar: true,
                    id: true,
                    role: true,
                },
                data: {
                    email: emails[0].value,
                    full_name: displayName ? displayName : emails[0].value.split('@')[0].toString().toLowerCase(),
                    password: id,
                    joinAt: new Date(),
                    google_app_id: id,
                    avatar: profile.photos[0].value.trim(),
                }
            });

            const ownAccessToken = this.token.sign({
                userId: user.id,
                role: user.role
            });

            //update user token when loggedIn
            await this.prisma.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    token: ownAccessToken,
                }
            })

            const info = {
                name: user.full_name,
                email: user.email,
                avatar: user.avatar,
            };

            const payload = { info, token: ownAccessToken }

            done(null, payload);
        } else {
            //create token
            const ownAccessToken = this.token.sign({
                userId: isExist.id,
                role: isExist.role
            })

            //update user token when loggedIn
            await this.prisma.users.update({
                where: {
                    id: isExist.id,
                },
                data: {
                    token: ownAccessToken,
                }
            })

            const info = {
                name: isExist.full_name,
                email: isExist.email,
                avatar: isExist.avatar,
            };


            // const payload = this.response.create(HttpStatus.OK, 'Login successfully!', { info, token: ownAccessToken })
            const payload = { info, token: ownAccessToken }

            done(null, payload);

        }

    }

}