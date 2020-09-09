import { IIdObject, ISystemAppsListContainer } from 'communication';
import { ISkill } from './skill';

export interface IResource<T extends (HumanResourceStatus | MaterialResourceStatus | GenericResourceStatus) = any> {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    code: string;
    kind: ResourceKind;
    status: T;
    availability?: any; // todo add type
    active?: boolean;
}

export interface IMaterialResource extends IResource<MaterialResourceStatus> {
    name: string;
    responsible: number;
    locationId: number;
}

export interface IGenericResource extends IResource<GenericResourceStatus> {
    name: string;
    internalRate: IResourceRate;
    billableRate: IResourceRate;
}

export interface IHumanResource extends IResource<HumanResourceStatus>, ISystemAppsListContainer {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    responsible: number;
    type: number;
    skills: ISkill[];
    password?: string;
    confirmPassword?: string;
    locationId: number;
    systemRoleId?: number;
}

export interface IUpdateHumanResourceStatus extends IIdObject {
    status: HumanResourceStatus;
    alternativeProjectManager?: number;
}

export type AnyResource = IMaterialResource | IHumanResource | IGenericResource;

export enum HumanResourceStatus {
    Pending,
    Active,
    Revoked,
}

export enum MaterialResourceStatus {
    Active,
    Inactive,
}

export enum GenericResourceStatus {
    Active,
    Inactive,
}

export enum ResourceKind {
    Human,
    Material,
    Generic,
}

export interface IResourceRate {
    value: number;
    currency: number;
}
