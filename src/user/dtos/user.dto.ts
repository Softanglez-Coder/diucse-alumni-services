import { Role } from '../../auth/role';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;

  @IsString()
  hash?: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
