import { Controller, Get, Res, Query, Post, Body, UseInterceptors, UseGuards } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { Response } from 'express';
import { CreateVnpayDto } from 'src/libs/dto';
import RenewalInterceptor from 'src/libs/interceptors/renewal.interceptor';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { Auth } from 'src/libs/decorators/common.decorator';



@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Post('/create_payment_url')
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @UseInterceptors(RenewalInterceptor)
  @Auth()
  async makePayment(
    @Body() body: CreateVnpayDto,
  ) {
    const paymentUrl = this.vnpayService.createPayment(body);
    return paymentUrl;
  }

  @Get('/vnpay_return')
  @UseInterceptors(RenewalInterceptor)
  vnpayReturn(
    @Res() res: Response,
    @Query() query: Record<string, string>,
  ) {
    const isValid = this.vnpayService.verifyPayment(query);
    if (isValid) {
      res.redirect(`http://localhost:3000/payment/result`)
    }
    return {
      status: 500,
      mess: 'Thanh toán không thành công!',
      content: isValid,
    }
  }

}
