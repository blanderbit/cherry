import { IIdObject } from 'communication';

export interface ISubscription extends IIdObject {
    name: string;
}

export interface SysSubscription {
    status?: string;
    updated_time?: string;
    created_time?: string;
}

export interface ProductModel extends SysSubscription{
    product_id: string;
    name: string;
    description?: string;
    email_ids?: string;
    redirect_url?: string;
}

export interface PlanModel extends SysSubscription{
    plan_code: string;
    name: string;
    recurring_price: number;
    unit?: string;
    interval: number;
    interval_unit?: string;
    billing_cycles?: number;
    trial_period?: number;
    description?: string;
    product_id: string;
}

export interface CustomerAddressModel {
    attention?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: number | string;
    country?: string;
    fax?: string;
}

export interface CustomerModel extends SysSubscription{
    customer_id: string;
    display_name: string;
    salutation?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    company_name?: string;
    phone?: number;
    mobile?: number;
    website?: string;
    designation?: string;
    department?: string;
    billing_address?: CustomerAddressModel;
    shipping_address?: CustomerAddressModel;
    currency_code?: string;
    currency_id?: string;
    gst_no?: string;
    gst_treatment?: string;
    place_of_contact?: string;
    price_precision?: number;
    unused_credits?: number;
    outstanding?: number;
    notes?: string;
    source?: string;
    payment_terms_label?: string;
    is_linked_with_zohocrm?: boolean;
    primary_contactperson_id?: string;
}

export interface SubscriptionModel extends SysSubscription{
    subscription_id: string;
    name?: string;
    amount?: number;
    created_at?: string;
    activated_at?: string;
    current_term_starts_at?: string;
    current_term_ends_at?: string;
    last_billing_at?: string;
    next_billing_at?: string;
    expires_at?: string;
    interval?: number;
    interval_unit?: string;
    auto_collect?: boolean;
    reference_id?: string;
    salesperson_id?: string;
    salesperson_name?: string;
    child_invoice_id?: string;
    currency_code?: string;
    currency_symbol?: string;
    end_of_term?: boolean;
    product_id?: string;
    product_name?: string;
    plan: PlanModel;
    payment_terms?: number;
    payment_terms_label?: string;
    customer: CustomerModel;
}


