import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MembershipRequestDto, MembershipRequestUpdateDto } from './dto';
import { MembershipService } from './membership.service';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('create-user')
  async createUser(@Body() body: { membershipId: string }) {
    const { membershipId } = body;
    return await this.membershipService.createUser(membershipId);
  }

  @Post('request')
  async request(@Body() dto: MembershipRequestDto) {
    return await this.membershipService.request(dto);
  }

  @Get('pendings')
  async findPendings() {
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

  @Get(':id')
  async findById(@Param('id') id: string) {
    console.log(`Finding membership by ID: ${id}`);
    return await this.membershipService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: MembershipRequestUpdateDto,
  ) {
    return await this.membershipService.update(id, dto);
  }

  @Patch(':id/in-progress')
  async inProgress(@Param('id') id: string) {
    return await this.membershipService.inProgress(id);
  }

  @Patch(':id/validate')
  async validate(@Param('id') id: string) {
    return await this.membershipService.validate(id);
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return await this.membershipService.approve(id);
  }

  @Patch(':id/reject')
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
