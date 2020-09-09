import {IIdObject} from 'communication';

export interface ICurrency extends IIdObject {
    name: string;
    code: string;
}
