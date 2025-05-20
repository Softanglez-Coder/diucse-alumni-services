import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Batch, BatchDocument } from './batch.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../core';

@Injectable()
export class BatchRepository extends BaseRepository<BatchDocument> {
  constructor(
    @InjectModel(Batch.name) private model: Model<BatchDocument>,
  ) {
    super(model);
  }
}
