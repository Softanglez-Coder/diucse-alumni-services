import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('batch')
export class BatchController {
  constructor(private readonly service: BatchService) {}

  @Post()
  async create(@Body() dto: CreateBatchDto) {
    return await this.service.create(dto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.service.getAll();
  }
}
