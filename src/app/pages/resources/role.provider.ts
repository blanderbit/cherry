import { Injectable } from '@angular/core';
import { HumanResourcesProvider } from 'communication';

@Injectable()
export class RoleProvider {

    constructor(private _humanResourcesProvider: HumanResourcesProvider) {
    }

    getItems() {
        return this._humanResourcesProvider.getRoles();
    }
}
