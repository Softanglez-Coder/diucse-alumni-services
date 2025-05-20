import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BatchDocument = HydratedDocument<Batch>;

@Schema()
export class Batch {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
