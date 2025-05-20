import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  constructor(@Inject('CLOUDINARY') private client: typeof cloudinary) {}

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const stream = Readable.from(file.buffer);
    return new Promise((resolve, reject) => {
      const uploadStream = this.client.uploader.upload_stream(
        { resource_type: 'auto' }, // auto supports PDF, image, etc.
        (error, result: UploadApiResponse) => {
          if (error) {
            return reject(error);
          }

          resolve(result.secure_url);
        },
      );

      stream.pipe(uploadStream);
    });
  }
}
