import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { PaymentService } from '@payment';
import { PaymentRemarks } from '../payment/enums';
import { MembershipRequestDto } from './dto';
import { MembershipRequestStatus } from './enums/membership-request-status';
import { MEMBERSHIP_FEE } from './const/membership.config';
import { MembershipRepository } from './membership.repository';
import { isEmail, isMongoId, isUUID } from 'class-validator';
import { MembershipDocument } from './membership.schema';
import { BatchService } from '@batch';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly paymentService: PaymentService,
    private readonly batchService: BatchService,
  ) {}

  async request(dto: MembershipRequestDto) {
    const existingEmail = await this.membershipRepository.findByEmail(
      dto.email,
    );

    if (existingEmail) {
      throw new ConflictException(
        `Membership request with email ${dto.email} already exists.`,
      );
    }


    const existingPhone = await this.membershipRepository.findByPhone(
      dto.phone,
    );
    if (existingPhone) {
      throw new ConflictException(
        `Membership request with phone ${dto.phone} already exists.`,
      );
    }

    const batch = await this.batchService.findById(dto.batch);
    if (!batch) {
      throw new NotFoundException(`Batch with id ${dto.batch} not found`);
    }

    return await this.membershipRepository.create(dto);
  }

  async findById(id: string) {
    return await this.membershipRepository.findById(id);
  }

  async findPendings() {
    return await this.membershipRepository.findPendings();
  }

  async findInProgress() {
    return await this.membershipRepository.findInProgress();
  }

  async findValidated() {
    return await this.membershipRepository.findValidated();
  }

  async findApproved() {
    return await this.membershipRepository.findApproved();
  }

  async findRejected() {
    return await this.membershipRepository.findRejected();
  }

  async inProgress(id: string) {
    const membership = await this.membershipRepository.findById(id);

    if (!membership) {
      throw new NotFoundException(`Membership with id ${id} not found`);
    }

    if (membership.status === MembershipRequestStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Membership with id ${id} is already in status 'IN_PROGRESS'. It's time to mark it as validated.`,
      );
    }

    if (membership.status === MembershipRequestStatus.VALIDATED) {
      throw new BadRequestException(
        `Membership with id ${id} is already validated. Please approve or reject it.`,
      );
    }

    if (membership.status === MembershipRequestStatus.APPROVED) {
      throw new BadRequestException(
        `Membership with id ${id} is already approved. No further actions are required.`,
      );
    }

    if (membership.status === MembershipRequestStatus.REJECTED) {
      throw new BadRequestException(
        `Membership with id ${id} is rejected. No further actions are required.`,
      );
    }

    if (membership.status !== MembershipRequestStatus.PENDING) {
      throw new BadRequestException(
        `Membership with id ${id} is not in status 'PENDING'. Only pending memberships can be marked as in progress.`,
      );
    }

    return await this.membershipRepository.inProgress(id);
  }

  async validate(id: string) {
    const membership = await this.membershipRepository.findById(id);

    if (!membership) {
      throw new NotFoundException(`Membership with id ${id} not found`);
    }

    if (membership.status === MembershipRequestStatus.VALIDATED) {
      throw new BadRequestException(
        `Membership with id ${id} is already validated. It can only be approved or rejected now.`,
      );
    }

    if (membership.status === MembershipRequestStatus.APPROVED) {
      throw new BadRequestException(
        `Membership with id ${id} is already approved. No further actions are required.`,
      );
    }

    if (membership.status === MembershipRequestStatus.REJECTED) {
      throw new BadRequestException(
        `Membership with id ${id} is rejected. No further actions are required.`,
      );
    }

    if (membership.status !== MembershipRequestStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Membership with id ${id} is not in status 'IN_PROGRESS'. Please review the status first.`,
      );
    }

    return await this.membershipRepository.validate(id);
  }

  async approve(id: string) {
    const membership = await this.membershipRepository.findById(id);

    if (!membership) {
      throw new NotFoundException(`Membership with id ${id} not found`);
    }

    if (membership.status === MembershipRequestStatus.APPROVED) {
      throw new BadRequestException(
        `Membership with id ${id} is already approved. No further actions are required.`,
      );
    }

    if (membership.status === MembershipRequestStatus.REJECTED) {
      throw new BadRequestException(
        `Membership with id ${id} is rejected. No further actions are required.`,
      );
    }

    if (membership.status !== MembershipRequestStatus.VALIDATED) {
      throw new BadRequestException(
        `Membership with id ${id} is not in status 'VALIDATED'. Please validate it first.`,
      );
    }

    const payment = await this.paymentService.getById(membership.payment?.id);
    if (!payment) {
      throw new NotFoundException(
        `Payment with id ${membership.payment?.id} not found`,
      );
    }

    const paid = payment.amount >= MEMBERSHIP_FEE;

    if (!paid) {
      throw new BadRequestException(
        `Payment for membership with id ${id} is not sufficient. Required: ${MEMBERSHIP_FEE}, Provided: ${payment.amount}`,
      );
    }

    const updatedMembership = await this.membershipRepository.approve(id);
    if (!updatedMembership) {
      throw new HttpException(
        `Failed to approve membership with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedMembership;
  }

  async reject(id: string, justification: string) {
    const membership = await this.membershipRepository.findById(id);

    if (!membership) {
      throw new NotFoundException(`Membership with id ${id} not found`);
    }

    if (membership.status === MembershipRequestStatus.REJECTED) {
      throw new BadRequestException(
        `Membership with id ${id} is already rejected. No further actions are required.`,
      );
    }

    if (membership.status !== MembershipRequestStatus.VALIDATED) {
      throw new BadRequestException(
        `Membership with id ${id} is not in status 'VALIDATED'. Please validate it first.`,
      );
    }

    return await this.membershipRepository.reject(id, justification);
  }

  async pay(id: string) {
    const mongoId = isMongoId(id);
    const email = isEmail(id);
    const phone = !mongoId && !email;

    let membership: MembershipDocument;

    if (mongoId) {
      membership = await this.membershipRepository.findById(id);
    } else if (email) {
      membership = await this.membershipRepository.findByEmail(id);
    } else if (phone) {
      membership = await this.membershipRepository.findByPhone(id);
    }

    if (!membership) {
      throw new NotFoundException(`Membership with id ${id} not found`);
    }

    if (membership.status !== MembershipRequestStatus.VALIDATED) {
      throw new BadRequestException(
        `Membership with id ${id} is not in status 'VALIDATED'. Please validate it first.`,
      );
    }

    const payment = await this.paymentService.create({
      amount: MEMBERSHIP_FEE,
      product: {
        id: null,
        name: 'Membership Fee',
        category: PaymentRemarks.MEMBERSHIP_FEE,
      },
      customer: {
        name: membership.name,
        email: membership.email,
        phone: membership.phone,
        id: null,
      },
    });

    const paid = await this.membershipRepository.pay(id, payment.id);
    if (!paid) {
      throw new HttpException(
        `Failed to process payment for membership with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return payment;
  }
}
