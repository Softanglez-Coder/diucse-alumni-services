import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { MembershipRequestDto } from './dto';
import { MembershipService } from './membership.service';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('request')
  async request(@Body() dto: MembershipRequestDto) {
    return await this.membershipService.request(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.membershipService.findById(id);
  }

  @Get('pendings')
  async findAll() {
    return await this.membershipService.findPendings();
  }

  @Get('in-progress')
  async findInProgress() {
    return await this.membershipService.findInProgress();
  }

  @Get('validated')
  async findValidated() {
    return await this.membershipService.findValidated();
  }

  @Get('approved')
  async findApproved() {
    return await this.membershipService.findApproved();
  }

  @Get('rejected')
  async findRejected() {
    return await this.membershipService.findRejected();
  }

  @Post(':id/in-progress')
  async inProgress(@Param('id') id: string) {
    return await this.membershipService.inProgress(id);
  }

  @Post(':id/validate')
  async validate(@Param('id') id: string) {
    return await this.membershipService.validate(id);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    return await this.membershipService.approve(id);
  }

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body('justification') justification: string,
  ) {
    if (!justification || justification.trim() === '') {
      throw new BadRequestException('Justification is required for rejection');
    }

    return await this.membershipService.reject(id, justification);
  }

  @Post(':id/pay')
  async pay(@Param('id') id: string) {
    return await this.membershipService.pay(id);
  }
}
