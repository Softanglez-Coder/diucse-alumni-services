import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { IPNStatus } from '../enums';

export class IPNDto {
  @IsEnum(IPNStatus)
  @IsNotEmpty()
  status: IPNStatus;

  @IsNotEmpty()
  tran_id: string;

  @IsNotEmpty()
  store_amount: number;
}
