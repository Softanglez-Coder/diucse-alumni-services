import { Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "./dtos";
import { SSLComz } from "./providers";
import { SSLComzInit } from "./providers/sslcomz/sslcomz-init";

@Injectable()
export class PaymentService {
    constructor(
        private readonly provider: SSLComz
    ) {}

    create(dto: CreatePaymentDto) {
        const payload = new SSLComzInit(
            dto.amount,
            dto.host,
            dto.product.name,
            dto.product.category,
            dto.customer.name,
            dto.customer.email,
            dto.customer.phone
        );

        const { tran_id: trxId } = payload;

        return this.provider.init(payload);
    }
}