import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaRepository } from './media.repository';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storageService: StorageService,
  ) {}

  async upload(file: Express.Multer.File) {
    const url = await this.storageService.upload(file);

    const media = new CreateMediaDto();
    media.url = url as string;

    const created = await this.mediaRepository.create(media);
    return created;
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
