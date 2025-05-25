import { Controller, Post } from "@nestjs/common";

@Controller('payment')
export class PaymentController {
    @Post()
    initiate() {}

    // Handle Instant Payment Notification (IPN) from payment provider
    // This is typically used to confirm payment status asynchronously
    @Post('ipn')
    ipn() {
        
    }
}