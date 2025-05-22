import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Param,
  NotFoundException,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMediaDto, UpdateMediaDto } from './dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async create(@Body() body: CreateMediaDto) {
    const media = await this.mediaService.create(body);
    return media;
  }

  @Get()
  async findAll(
    @Query('$search') search?: string,
    @Query('$sort') sort?: string,
    @Query('$limit') limit?: number,
    @Query('$skip') skip?: number,
    @Query('$select') select?: string[],
  ) {
    const media = await this.mediaService.findAll({ search, sort, limit, skip, select });
    return media;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const media = await this.mediaService.findById(id);

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateMediaDto) {
    const updated = await this.mediaService.update(id, body);

    if (!updated) {
      throw new NotFoundException('Media not found');
    }

    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.mediaService.delete(id);

    if (!deleted) {
      throw new NotFoundException('Media not found');
    }

    return deleted;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 0.5 * 1024 * 1024, // 500 KB
      },
      fileFilter: (_, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
        ]; // only allow image types

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }

        callback(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.mediaService.upload(file);

    if (!url) {
      throw new HttpException(
        'Failed to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const media: CreateMediaDto = {
      name: url.split('/').pop() || '',
      url,
    };

    const created = await this.mediaService.create(media);
    return created;
  }
}
