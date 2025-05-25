import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentDto, IPNDto } from './dtos';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return await this.service.create(dto);
  }

  // Handle Instant Payment Notification (IPN) from payment provider
  // This is typically used to confirm payment status asynchronously
  @Post('ipn')
  async ipn(@Body() payload: IPNDto) {
    console.log('Received IPN:', JSON.stringify(payload));
    return await this.service.handleIPN(payload);
  }
}
