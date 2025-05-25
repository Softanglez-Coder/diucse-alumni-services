export class CreatePaymentDto {
    amount: number;
    host: string;
    product: CreatePaymentProduct;
    customer: CreatePaymentCustomer;
}

export class CreatePaymentProduct {
    name: string;
    category: string;
}

export class CreatePaymentCustomer {
    name: string;
    email: string;
    phone: string;
}