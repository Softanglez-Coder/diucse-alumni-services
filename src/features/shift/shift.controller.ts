import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShiftService } from './shift.service';

@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  async create(@Body() body: { name: string }) {
    return await this.shiftService.create(body.name);
  }

  @Get()
  async findAll() {
    return await this.shiftService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.shiftService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.shiftService.update(id, body.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.shiftService.delete(id);
  }
}
