import { IIdObject } from 'communication';

export interface ICompany extends IIdObject {
    id: number;
    name: string;
    logo: string;
    creatorId: number;
    logoUrl?: string;
}

export interface ICompanyIdProvider {
    companyId: number | string;
}
