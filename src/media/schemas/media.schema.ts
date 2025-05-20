import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema()
export class Media {
  @Prop()
  url: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);