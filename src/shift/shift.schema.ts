import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShiftDocument = HydratedDocument<Shift>;

@Schema()
export class Shift {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
