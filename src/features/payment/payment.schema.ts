import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    })
    member: string;

    @Prop({
        required: true,
        type: String
    })
    remarks: string;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    })
    status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);