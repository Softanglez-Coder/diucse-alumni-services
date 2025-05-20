import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../auth/role';

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ default: true, required: true })
  active: boolean;

  @Prop({
    required: true,
    type: [String],
    enum: Object.values(Role),
    default: [Role.Guest],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
