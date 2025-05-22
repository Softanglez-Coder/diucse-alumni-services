import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from './media.schema';
import { BaseRepository } from '@core';

@Injectable()
export class MediaRepository extends BaseRepository<MediaDocument> {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {
    super(mediaModel);
  }
}
