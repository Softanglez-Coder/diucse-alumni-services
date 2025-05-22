import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUrl()
  url!: string;
}
