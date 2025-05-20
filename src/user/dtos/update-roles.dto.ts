import { Role } from '../../auth/role';
import { IsArray, IsEnum } from 'class-validator';

export class UpdateRolesDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
