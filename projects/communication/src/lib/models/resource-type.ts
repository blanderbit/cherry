export interface IRate {
    currency: string;
    value: number;
}

export interface IResourceType {
    id: number;
    name: string;
    // billable rate
    rate: number;
    currency: number;
}
