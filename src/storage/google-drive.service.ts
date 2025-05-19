import { Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleDriveService {
  private client: drive_v3.Drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      // TODO: Replace with your own credentials
      keyFile: 'key.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    this.client = google.drive({ version: 'v3', auth });
  }

  async upload(path: string, type: string): Promise<drive_v3.Schema$File> {
    const metadata = {
      name: (Date.now() + Math.ceil(Math.random() * 1_000_000)).toString(), // Extract the file name from the path
    };

    const media = {
      mimeType: type,
      body: fs.createReadStream(path),
    };

    const response = await this.client.files.create({
      requestBody: metadata,
      media: media,
      fields: 'id',
    });

    return response.data;
  }

  async delete(fileId: string): Promise<void> {
    await this.client.files.delete({
      fileId: fileId,
    });
  }

  async getFile(fileId: string): Promise<drive_v3.Schema$File> {
    const response = await this.client.files.get({
      fileId: fileId,
      fields: '*',
    });

    return response.data;
  }
}