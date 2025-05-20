import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('shift')
export class ShiftController {
  constructor(private readonly service: ShiftService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateShiftDto) {
    return await this.service.create(dto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.service.getAll();
  }
}
