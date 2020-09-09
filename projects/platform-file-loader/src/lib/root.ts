import { InjectionToken } from '@angular/core';

export const ROOT = new InjectionToken<string>('ROOT');

export class Config {
    root: string;
}
