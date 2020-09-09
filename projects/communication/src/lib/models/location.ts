import { IIdObject } from 'communication';

export interface ILocation extends IIdObject {
    name: string;
    address: string;
    countryId: string;
    countryName?: string;
    holidayPolicyId: number;
}
