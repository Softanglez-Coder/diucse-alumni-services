import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PaymentRemarks, PaymentStatus } from "./enums";

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
    timestamps: true,
})
export class Payment {
    @Prop({
        required: true,
        type: String,
        unique: true,
        index: true,
        trim: true,
        immutable: true,
    })
    trxId: string;

    @Prop({
        required: true,
        type: Number,
        min: 0,
    })
    amount: number;

    @Prop({
        required: true,
        type: Number,
        min: 0,
        default: 0,
    })
    depositAmount: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    })
    member: string;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(PaymentRemarks),
    })
    remarks: string;

    @Prop({
        type: String,
        trim: true,
        default: null,
    })
    referenceId?: string;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    })
    status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);