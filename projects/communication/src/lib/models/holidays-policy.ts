import { IIdObject } from 'communication';

export interface IHolidaysPolicy extends IIdObject {
    name: string;
    countryId: string;
    countryName?: string;
    // date: number;
}
