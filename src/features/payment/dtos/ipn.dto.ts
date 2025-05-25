import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { IPNStatus } from "../enums";

export class IPNDto {
    @IsEnum(IPNStatus)
    @IsNotEmpty()
    status: IPNStatus;

    @IsNotEmpty()
    @IsUUID()
    tran_id: string;

    @IsNumber()
    @IsNotEmpty()
    store_amount: number;
}