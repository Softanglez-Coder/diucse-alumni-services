import { BadRequestException, Injectable } from '@nestjs/common';
import { ShiftRepository } from './shift.repository';
import { Shift } from './shift.schema';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly repository: ShiftRepository) {}

  async getAll(): Promise<CreateShiftDto[]> {
    return await this.repository.findAll();
  }

  async create(dto: CreateShiftDto): Promise<CreateShiftDto> {
    const existing = await this.repository.findByProperty(
      'name',
      dto.name,
    );

    if (existing) {
      throw new BadRequestException('Country name already exists');
    }

    const data = new Shift();
    data.name = dto.name;

    const created = await this.repository.create(data);
    return created;
  }
}
