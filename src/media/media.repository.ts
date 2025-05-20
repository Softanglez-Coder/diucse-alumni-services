import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from './schemas/media.schema';

@Injectable()
export class MediaRepository {
  constructor(@InjectModel(Media.name) private media: Model<Media>) {}

  async create(media: Media): Promise<Media> {
    const created = new this.media(media);
    return await created.save();
  }
}
