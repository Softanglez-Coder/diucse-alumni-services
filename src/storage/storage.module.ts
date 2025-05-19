import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { GoogleDriveModule } from 'nestjs-google-drive';
import * as process from 'node:process';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    GoogleDriveModule.register({
      clientId: process.env.G_DRIVE_CLIENT_ID,
      clientSecret: process.env.G_DRIVE_CLIENT_SECRET,
      redirectUrl: process.env.G_DRIVE_REDIRECT_URL,
      refreshToken: process.env.G_DRIVE_REFRESH_TOKEN,
    }),
    MediaModule,
  ],
  controllers: [StorageController],
  providers: [
    StorageService
  ],
})
export class StorageModule {}
