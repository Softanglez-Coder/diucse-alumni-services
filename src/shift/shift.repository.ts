import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shift, ShiftDocument } from './shift.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../core';

@Injectable()
export class ShiftRepository extends BaseRepository<ShiftDocument> {
  constructor(
    @InjectModel(Shift.name) private model: Model<ShiftDocument>,
  ) {
    super(model);
  }
}
