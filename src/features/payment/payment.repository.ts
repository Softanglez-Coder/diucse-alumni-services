import { BaseRepository } from "@core";
import { Injectable } from "@nestjs/common";
import { PaymentDocument } from "./payment.schema";

@Injectable()
export class PaymentRepository extends BaseRepository<PaymentDocument> {}