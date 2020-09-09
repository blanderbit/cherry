import { IIdObject } from 'communication';

export interface IResourceInfo extends IIdObject {
    type: string;
    billableRate: number;
    currency: string;
}
