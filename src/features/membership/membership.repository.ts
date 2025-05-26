import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MembershipRequestDto } from './dto';
import { MembershipRequestStatus } from './enums/membership-request-status';
import { Membership, MembershipDocument } from './membership.schema';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<MembershipDocument>,
  ) {}

  async create(dto: MembershipRequestDto): Promise<MembershipDocument> {
    const membership = new this.membershipModel(dto);
    return await membership.save();
  }

  async findById(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findById(id)
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findByEmail(email: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findOne({ email })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findByPhone(phone: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findOne({ phone })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findPendings(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.PENDING })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findInProgress(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.IN_PROGRESS })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findValidated(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.VALIDATED })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findApproved(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.APPROVED })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async findRejected(): Promise<MembershipDocument[]> {
    return await this.membershipModel
      .find()
      .where({ status: MembershipRequestStatus.REJECTED })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async inProgress(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        { status: MembershipRequestStatus.IN_PROGRESS },
        { new: true },
      )
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async validate(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        { status: MembershipRequestStatus.VALIDATED },
        { new: true },
      )
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async approve(id: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        { status: MembershipRequestStatus.APPROVED },
        { new: true },
      )
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async reject(id: string, justification: string): Promise<MembershipDocument | null> {
    return await this.membershipModel
      .findByIdAndUpdate(
        id,
        {
          status: MembershipRequestStatus.REJECTED,
          justification,
        },
        { new: true },
      )
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }

  async pay(id: string, paymentId: string) {
    return await this.membershipModel
      .findByIdAndUpdate(id, { payment: paymentId }, { new: true })
      .populate('batch')
      .populate('shift')
      .populate('payment')
      .exec();
  }
}
