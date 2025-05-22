import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateMediaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: string;
}
