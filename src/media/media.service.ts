import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository
  ) {
  }

  create(media: CreateMediaDto) {
    return this.mediaRepository.create(media);
  }

  findAll() {
    return this.mediaRepository.findAll();
  }

  findOne(id: string) {
    return this.mediaRepository.findById(id);
  }

  update(id: string, media: UpdateMediaDto) {
    return this.mediaRepository.updateById(id, media);
  }

  remove(id: string) {
    return this.mediaRepository.deleteById(id);
  }
}
