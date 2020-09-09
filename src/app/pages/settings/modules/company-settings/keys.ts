import { InjectionToken, Type } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ICompanySettingsPermissions } from './models/permissions';

export const PARAM_KEYS = {
    POLICY_ID: 'holidayPolicyId',
    EDIT_QUERY: 'editId',
};
export const HEADER = new InjectionToken<Type<any>>('Company settings header');
export const FormContainer = new InjectionToken<ListComponent>('Company settings form container');
export const CompanySettingsPermissions = new InjectionToken<ICompanySettingsPermissions>('Company settings permissions');
