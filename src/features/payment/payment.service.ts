import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, IPNDto } from './dtos';
import { SSLComz } from './providers';
import { SSLComzInit } from './providers/sslcomz/sslcomz-init';
import { PaymentRepository } from './payment.repository';
import { Payment, PaymentDocument } from './payment.schema';
import { IPNStatus, PaymentRemarks, PaymentStatus } from './enums';

@Injectable()
export class PaymentService {
  constructor(
    private readonly provider: SSLComz,
    private readonly repository: PaymentRepository,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreatePaymentDto) {
    if (dto.product.category === PaymentRemarks.MEMBERSHIP_FEE) {
      dto.product.name = 'Membership Fee';
    }

    const payload = new SSLComzInit(
      dto.amount,
      dto.product.name,
      dto.product.category,
      dto.customer.name,
      dto.customer.email,
      dto.customer.phone,
    );

    this.logger.log('Creating payment with payload:', JSON.stringify(payload));

    const url = await this.provider.init(payload);
    if (!url) {
      throw new HttpException(
        'Failed to initialize payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { tran_id: trxId } = payload;

    // Save the transaction to the database
    const payment: Payment = {
      trxId,
      remarks: dto.product.category,
      amount: dto.amount,
      depositAmount: 0,
      member: dto.customer?.id,
      referenceId: dto.product?.id,
      status: PaymentStatus.PENDING,
    };

    const created = await this.repository.create(payment);

    if (!created) {
      throw new HttpException(
        'Failed to create payment record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      id: created.id,
      url,
    };
  }

  async getById(id: string) {
    if (!id) {
      throw new BadRequestException('Payment ID is required');
    }

    const payment: PaymentDocument = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    return payment;
  }

  async findAll() {
    const payments: PaymentDocument[] = await this.repository.findAll();
    return payments;
  }

  async handleIPN(payload: IPNDto) {
    const { status, tran_id: trxId, store_amount } = payload;

    // Validate the transaction ID
    if (!trxId) {
      throw new HttpException(
        'Transaction ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Find the payment record
    const payment: PaymentDocument = await this.repository.findByTrxId(trxId);

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Update the payment status and amount
    const parseStatus = () => {
      switch (status) {
        case IPNStatus.VALID:
          return PaymentStatus.COMPLETED;

        case IPNStatus.FAILED:
        case IPNStatus.CANCELLED:
        case IPNStatus.EXPIRED:
          return PaymentStatus.FAILED;

        case IPNStatus.UNATTEMPTED:
          return PaymentStatus.PENDING;
      }
    };

    payment.status = parseStatus();
    payment.depositAmount = store_amount;

    const updated = await this.repository.update(payment.id, payment);

    if (!updated) {
      throw new HttpException(
        'Failed to update payment record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updated;
  }
}
