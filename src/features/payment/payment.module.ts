import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Payment, PaymentSchema } from "./payment.schema";
import { PaymentService } from "./payment.service";
import { PaymentRepository } from "./payment.repository";
import { PaymentController } from "./payment.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Payment.name,
                schema: PaymentSchema,
            }
        ])
    ],
    controllers: [PaymentController],
    providers: [
        PaymentService,
        PaymentRepository
    ]
})
export class PaymentModule {}