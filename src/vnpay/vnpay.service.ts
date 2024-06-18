import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { compareAsc, format, addMinutes } from "date-fns";

@Injectable()
export class VnpayService {

  private vnp_TmnCode = 'C6X78S4Y';
  private vnp_HashSecret = 'Y8TQMV9ZHUEOV3IKRD3YIDT75VX8CIA6';
  private vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private vnp_ReturnUrl = 'http://localhost:8080/vnpay/vnpay_return';

  constructor(
    private readonly config: ConfigService,
  ) { }

  private sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  //http://localhost:8080/vnpay/create_payment_url?price=100000&bankCode=NCB&service=1&method=vnpay
  createPayment(cost: number, bankCode: string, service: string, method: string,) {
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
      'vnp_OrderInfo': JSON.stringify({ price: cost, service, method }), //chỗ này có thể thay = JSON.stringifuy data của hire
      'vnp_OrderType': 'billpayment',
      'vnp_Amount': (100 * cost).toString(),
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
    return this.vnp_Url + '?' + new URLSearchParams(vnp_Params).toString();

  }


  verifyPayment(vnp_Params: Record<string, string>) {
    const secureHash = vnp_Params['vnp_SecureHash'];
    const isSuccess = vnp_Params['vnp_ResponseCode'];
    const payload = vnp_Params['vnp_OrderInfo'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    const signData = new URLSearchParams(vnp_Params).toString();
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed && isSuccess == '00' && JSON.parse(payload);
  }

}
