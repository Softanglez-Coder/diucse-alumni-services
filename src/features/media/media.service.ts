import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaRepository } from './media.repository';
import { Query, StorageService } from '@core';
import { UpdateMediaDto } from './dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateMediaDto) {
    const created = await this.mediaRepository.create(dto);

    if (!created) {
      throw new HttpException(
        'Failed to create media record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return created;
  }

  async findAll(query: Query) {
    const media = await this.mediaRepository.findAll(query);

    if (!media) {
      throw new HttpException('No media found', HttpStatus.NOT_FOUND);
    }

    return media;
  }

  async findById(id: string) {
    const media = await this.mediaRepository.findById(id);

    if (!media) {
      throw new HttpException('Media not found', HttpStatus.NO_CONTENT);
    }

    return media;
  }

  async update(id: string, dto: UpdateMediaDto) {
    const updated = await this.mediaRepository.update(id, dto);

    if (!updated) {
      throw new HttpException(
        'Failed to update media record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.mediaRepository.delete(id);

    if (!deleted) {
      throw new HttpException(
        'Failed to delete media record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return deleted;
  }

  async upload(file: Express.Multer.File) {
    const url = await this.storageService.upload(file);

    if (!url) {
      throw new HttpException(
        'URL not found after uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return url;
  }
}
