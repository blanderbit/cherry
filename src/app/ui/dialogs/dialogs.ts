import { InjectionToken } from '@angular/core';

export const DialogConfig = new InjectionToken('Dialog config');

export interface IConfirmDialogParams {
    title?: string;
    description?: string;
    confirm?: string;
    reject?: string;
}
