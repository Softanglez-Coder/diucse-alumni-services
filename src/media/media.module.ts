import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { MediaRepository } from './media.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
  ],
  controllers: [MediaController],
  exports: [
    MediaService
  ],
  providers: [
    MediaService,
    MediaRepository
  ],
})
export class MediaModule {}
