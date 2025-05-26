import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './membership.schema';
import { MembershipController } from './membership.controller';
import { MembershipRepository } from './membership.repository';
import { MembershipService } from './membership.service';
import { PaymentModule } from '@payment';
import { BatchModule } from '@batch';
import { ShiftModule } from '@shift';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
    ]),
    PaymentModule,
    BatchModule,
    ShiftModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipRepository, MembershipService],
})
export class MembershipModule {}
