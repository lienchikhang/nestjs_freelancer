import { Controller, Get, Res, Query } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { Response } from 'express';


@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Get('/create_payment_url')
  makePayment(
    @Res() res: Response,
    @Query('bankCode') bankCode: string,
    @Query('service') service: string,
    @Query('price') price: number,
    @Query('method') method: string,
  ) {
    const paymentUrl = this.vnpayService.createPayment(price, bankCode, service, method);
    return res.redirect(paymentUrl);
  }

  @Get('/vnpay_return')
  vnpayReturn(
    @Query() query: Record<string, string>,
  ) {
    const isValid = this.vnpayService.verifyPayment(query);
    if (isValid) {
      return {
        status: 200,
        mess: 'Thanh toán thành công!',
        content: isValid,
      };
    }
    return {
      status: 500,
      mess: 'Thanh toán không thành công!',
      content: isValid,
    }
  }

}
