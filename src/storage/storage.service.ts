import { Injectable } from '@nestjs/common';
import { GoogleDriveService } from 'nestjs-google-drive';
import { MediaService } from '../media/media.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';

@Injectable()
export class StorageService {
  private readonly folderId: string = process.env.G_DRIVE_FOLDER_ID;

  constructor(
    private readonly gDriveService: GoogleDriveService,
    private readonly mediaService: MediaService,
  ) {}

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    try {
      const url = await this.gDriveService.uploadFile(file, this.folderId);

      const media = new CreateMediaDto();
      media.url = url;

      const created = await this.mediaService.create(media);
      return created;
    } catch (e) {
      throw new Error(`Error uploading file: ${e.message}`);
    }
  }
}
