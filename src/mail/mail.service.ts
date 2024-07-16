import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import * as nodemailer from 'nodemailer';
import Otp from 'src/libs/others/alphabet';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class MailService {

  private transporter;


  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly response: ResponseService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Thay thế bằng host của SMTP server
      port: 587, // Cổng kết nối
      secure: false, // True cho cổng 465, false cho các cổng khác (587)
      auth: {
        user: 'chikhang11a18@gmail.com', // Thay thế bằng email của bạn
        pass: 'ffosqtzouzxmicga' // Thay thế bằng mật khẩu email của bạn
      }
    });
  }

  async send({ to }: CreateMailDto) {

    const OTP = Otp.generate();

    console.log('otp', OTP);

    let mailOptions = {
      from: '"Freelancer" <freelancerService@gmail.com>', // Địa chỉ email người gửi
      to, // Địa chỉ email người nhận
      subject: 'Freelancer - OTP', // Chủ đề email
      html: `<div>
        <h1>Please do not share this to anyone else!</h1>
        <p>Here is your OTP: <strong>${OTP}</strong></p>
        <p>This OTP will expire after 15 minutes!</p>
      </div>` // Văn bản email định dạng HTML
    };

    //check OTP exists
    const isExistOTP = await this.cacheManager.get(to);
    if (isExistOTP) {
      await this.cacheManager.del(to);
    }
    //save OTP to redis
    await this.cacheManager.set(to, OTP);

    //send OTP
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8b1b9b9b1a5b1a5b1a5b1a5b1a5b1a5b1a5b1a5b1a5b1a5b1a5b1a5>
    });


    return this.response.create(HttpStatus.OK, 'Send mail successfully!', null);
  }

  verifyOTP() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}
