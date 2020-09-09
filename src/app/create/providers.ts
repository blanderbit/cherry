import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export abstract class CreateProvider<T = any> {
    abstract createItem(item: T): Observable<T>;
}

export const ModuleAlias = new InjectionToken('ModuleAlias');

export interface ICreateComponentConfig<T = any> {
    hideTypeCheckboxes: boolean;

    handleRequestParams(params: T): T;
    onSuccessCreate(item: T): void;
}

export const CreateComponentConfig = new InjectionToken<ICreateComponentConfig>('Create component config');
