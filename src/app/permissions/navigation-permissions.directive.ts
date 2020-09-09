import { INavigationItem } from '../ui/sidebar/sidebar/sidebar.component';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from './services/permissions.service';

@Directive({
    selector: '[hasChildRoute]',
})
export class NavigationPermissionsDirective {
    private _item: INavigationItem;

    @Input()
    protected set hasChildRoute(item: INavigationItem) {
        this._item = item;

        this._setAccess();
    }

    constructor(private _viewContainerRef: ViewContainerRef,
                private _templateRef: TemplateRef<any>,
                private _permissionsService: PermissionsService) {}

    private _isChildrenHasPermissions(): boolean {
        if (!this._item.navigation || !this._item.navigation.length) return true;

        return this._item.navigation
            .some((item) => this._permissionsService.hasPermissions(item.permissionAction));
    }

    private _setAccess() {
        if (this._isChildrenHasPermissions()) {
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainerRef.clear();
        }
    }
}



