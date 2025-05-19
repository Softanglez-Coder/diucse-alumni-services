import { Injectable } from '@nestjs/common';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';

@Injectable()
export class CommitteeService {
  create(createCommitteeDto: CreateCommitteeDto) {
    return 'This action adds a new committee';
  }

  findAll() {
    return `This action returns all committee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} committee`;
  }

  update(id: number, updateCommitteeDto: UpdateCommitteeDto) {
    return `This action updates a #${id} committee`;
  }

  remove(id: number) {
    return `This action removes a #${id} committee`;
  }
}
