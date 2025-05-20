import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from './batch.schema';
import { BatchRepository } from './batch.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Batch.name,
        schema: BatchSchema,
      }
    ])
  ],
  controllers: [BatchController],
  providers: [
    BatchService,
    BatchRepository
  ],
})
export class BatchModule {}
