import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BatchService } from './batch.service';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  async create(@Body() body: { name: string }) {
    const { name } = body;
    return await this.batchService.create(name);
  }

  @Get()
  findAll() {
    return this.batchService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.batchService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    const { name } = body;
    return await this.batchService.update(id, name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.batchService.delete(id);
  }
}
