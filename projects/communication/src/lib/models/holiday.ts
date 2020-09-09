import { IIdObject } from './id.object';

export interface IHoliday extends IIdObject {
    holidayPolicyId: number;
    name: string;
    date: number;
}
