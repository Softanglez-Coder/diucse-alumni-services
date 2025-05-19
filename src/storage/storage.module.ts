import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { GoogleDriveService } from './google-drive.service';

@Module({
  controllers: [StorageController],
  providers: [
    GoogleDriveService,
    StorageService
  ],
})
export class StorageModule {}
