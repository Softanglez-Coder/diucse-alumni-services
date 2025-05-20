import { BadRequestException, Injectable } from '@nestjs/common';
import { BatchRepository } from './batch.repository';
import { Batch } from './batch.schema';
import { CreateBatchDto } from './dto/create-batch.dto';

@Injectable()
export class BatchService {
  constructor(private readonly repository: BatchRepository) {}

  async getAll(): Promise<CreateBatchDto[]> {
    return await this.repository.findAll();
  }

  async create(dto: CreateBatchDto): Promise<CreateBatchDto> {
    const existing = await this.repository.findByProperty(
      'name',
      dto.name,
    );

    if (existing) {
      throw new BadRequestException('Country name already exists');
    }

    const data = new Batch();
    data.name = dto.name;

    const created = await this.repository.create(data);
    return created;
  }
}
