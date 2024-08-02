import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { compareAsc, format, addMinutes } from "date-fns";
import { ErrorHandlerService } from 'src/error-handler/error-handler.service';
import { CreateVnpayDto } from 'src/libs/dto';
import { PAYMENT } from 'src/libs/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class VnpayService {

  private vnp_TmnCode = 'C6X78S4Y';
  private vnp_HashSecret = 'Y8TQMV9ZHUEOV3IKRD3YIDT75VX8CIA6';
  private vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private vnp_ReturnUrl = 'http://localhost:8080/vnpay/vnpay_return';

  constructor(
    private readonly config: ConfigService,
    private readonly response: ResponseService,
    private readonly prisma: PrismaService,
    private readonly errorHandler: ErrorHandlerService,
  ) { }

  private sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  //cost: number, bankCode: string, service: string, method: string,
  //http://localhost:8080/vnpay/create_payment_url?price=100000&bankCode=NCB&service=1&method=vnpay
  async createPayment({ price, service, method, bankCode, name, jobId, email, }: CreateVnpayDto) {
    try {

      console.log({ price, service, method, bankCode, name, jobId, email })
      //check user exist
      const userExist = await this.prisma.users.findFirst({
        where: {
          email: email,
        }
      });

      if (!userExist) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'User not exist', null));

      const date = new Date();
      const createDate = format(date, 'yyyyMMddHHmmss');
      const orderId = format(date, 'HH:mm:ss');
      const expiredDate = addMinutes(date, 10);
      const formattedExpiredDate = format(expiredDate, 'yyyyMMddHHmmss');
      // const bankCode = 'NCB'
      let vnp_Params: Record<string, string> = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': this.vnp_TmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': JSON.stringify({ price, service, method, name, jobId, xs: userExist.id }), //chỗ này có thể thay = JSON.stringifuy data của hire
        'vnp_OrderType': 'billpayment',
        'vnp_Amount': (100 * price).toString(),
        'vnp_ReturnUrl': this.vnp_ReturnUrl,
        'vnp_IpAddr': '127.0.0.1',
        'vnp_CreateDate': createDate,
        'vnp_ExpireDate': formattedExpiredDate,
      };

      if (bankCode) {
        vnp_Params['vnp_BankCode'] = 'NCB';
      }

      vnp_Params = this.sortObject(vnp_Params);

      const signData = new URLSearchParams(vnp_Params).toString();
      const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      const finalUrl = this.vnp_Url + '?' + new URLSearchParams(vnp_Params).toString();
      return this.response.create(HttpStatus.OK, 'successfully', finalUrl);
    } catch (error) {
      console.log('error in vnpay', error);
    }
  }


  async verifyPayment(vnp_Params: Record<string, string>) {
    try {
      const secureHash = vnp_Params['vnp_SecureHash'];
      const isSuccess = vnp_Params['vnp_ResponseCode'];
      const payload = vnp_Params['vnp_OrderInfo'];
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = this.sortObject(vnp_Params);

      const signData = new URLSearchParams(vnp_Params).toString();
      const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      // return secureHash === signed && isSuccess == '00' && JSON.parse(payload);
      if (secureHash !== signed || isSuccess != '00') return false;

      const parsePayload = JSON.parse(payload);

      //check method
      if (parsePayload.method.toLowerCase() != PAYMENT.VNPAY.toLowerCase()) throw new BadRequestException(this.response.create(HttpStatus.BAD_REQUEST, 'Payment method not acceptable', parsePayload.method));

      //check service exist
      const isExist = await this.prisma.services.findUnique({
        where: {
          id: parsePayload.service,
        }
      });

      if (!isExist) throw new NotFoundException(this.response.create(HttpStatus.NOT_FOUND, 'Service not found!', null));

      //hire
      await this.prisma.hires.create({
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
          user_id: parsePayload.xs,
          service_id: parsePayload.service,
          method: parsePayload.method,
        },
      });

      return true;

    } catch (error) {
      console.log('error in vnpay verify');
      return this.errorHandler.createError(error.status, error.response);
    }
  }

}
