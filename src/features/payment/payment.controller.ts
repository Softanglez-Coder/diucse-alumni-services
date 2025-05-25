import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreatePaymentDto, IPNDto } from './dtos';
import { PaymentService } from './payment.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('success')
  async success(@Body() body: IPNDto, @Res() res: Response) {
    const handled = await this.service.handleIPN(body);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment success notification could not be processed.',
      };
    }

    const url: string = `${process.env.PAYMENT_SUCCESS_REDIRECT_URL}?paymentId=${handled.id}`;
    return res.redirect(url);
  }

  @Post('fail')
  async fail(@Body() body, @Res() res: Response) {
    const handled = await this.service.handleIPN(body);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment failure notification could not be processed.',
      };
    }

    const url: string = `${process.env.PAYMENT_FAIL_REDIRECT_URL}?paymentId=${handled.id}`;
    return res.redirect(url);
  }

  @Post('cancel')
  async cancel(@Body() body, @Res() res: Response) {
    const handled = await this.service.handleIPN(body);
    if (!handled) {
      return {
        status: 'error',
        message: 'Payment cancellation notification could not be processed.',
      };
    }

    const url: string = `${process.env.PAYMENT_CANCEL_REDIRECT_URL}?paymentId=${handled.id}`;
    return res.redirect(url);
  }
}
