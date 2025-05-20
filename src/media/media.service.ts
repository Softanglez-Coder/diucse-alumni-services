import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaRepository } from './media.repository';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storageService: StorageService,
  ) {}

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new Error(
        'No file provided. Please make sure you are passing a file to the upload method.',
      );
    }

    // upload media to storage
    const url = await this.storageService.upload(file);

    // create media to save in database for future reference
    const media = new CreateMediaDto();
    media.url = url as string;
    const created = await this.mediaRepository.create(media);

    // return the created media which includes the public url
    return created;
  }
}
