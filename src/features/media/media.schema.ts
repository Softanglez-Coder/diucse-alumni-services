import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({
  timestamps: true,
})
export class Media {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    unique: true,
    required: true,
  })
  url: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
