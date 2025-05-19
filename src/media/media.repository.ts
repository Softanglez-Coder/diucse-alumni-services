import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from './schemas/media.schema';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectModel(Media.name) private media: Model<Media>
  ) {
  }

  async create(media: Media): Promise<Media> {
    const created = new this.media(media);
    return await created.save();
  }

  async findAll(): Promise<Media[]> {
    return await this.media.find().exec();
  }

  async findById(id: string): Promise<Media> {
    return await this.media.findById(id).exec();
  }

  async updateById(id: string, media: Media): Promise<Media> {
    return await this.media.findByIdAndUpdate(id, media, { new: true }).exec();
  }

  async deleteById(id: string): Promise<Media> {
    return await this.media.findByIdAndDelete(id).exec();
  }
}