import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';

@Controller('committee')
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) {}

  @Post()
  create(@Body() createCommitteeDto: CreateCommitteeDto) {
    return this.committeeService.create(createCommitteeDto);
  }

  @Get()
  findAll() {
    return this.committeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.committeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommitteeDto: UpdateCommitteeDto) {
    return this.committeeService.update(+id, updateCommitteeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.committeeService.remove(+id);
  }
}
