import {
    AfterViewInit,
    Directive, ElementRef,
    Inject,
    InjectionToken,
    Injector,
    Input, OnDestroy,
    OnInit,
    Optional,
    Renderer2,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { PermissionsService } from './services/permissions.service';
import { PermissionActionType } from 'communication';
import { ControlContainer } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

// TODO: Rename
export interface IPermissionsDirectiveData {
    creatorId?: number;
    membersIds?: number[];
}

export type PermissionDirectiveParams = PermissionActionType | PermissionActionType[];

export const PERMISSIONS_DIRECTIVE_DATA = new InjectionToken<IPermissionsDirectiveData>('Permissions directive data');

@Directive({
    selector: '[hasPermissions]',
})
export class PermissionsDirective implements AfterViewInit, OnDestroy, IPermissionsDirectiveData {
    public _actions: PermissionActionType[];
    public _ownerId: number;
    protected templateRef: TemplateRef<any>;
    private _isAccessGranted: boolean;

    get actions() {
        return this._actions || [];
    }

    get ownerId() {
        return this._ownerId;
    }

    @Input()
    public set hasPermissions(actions: PermissionActionType | PermissionActionType[]) {
        this._actions = Array.isArray(actions) ? actions : [actions];
        this.checkAccess();
    }

    public get permissionsData() {
        return this._permissionsData;
    }

    @Input()
    public set permissionsData(value: IPermissionsDirectiveData) {
        this._permissionsData = value;
        this.checkAccess();
    }

    @Input()
    set creatorId(creatorId: number) {
        if (creatorId) {
            this.permissionsData = {...this.permissionsData, creatorId};
        }
    }

    @Input()
    set membersIds(membersIds: number[]) {
        if (membersIds) {
            this.permissionsData = {...this.permissionsData, membersIds};
        }
    }

    constructor(
        protected _permissionsService: PermissionsService,
        protected viewContainerRef: ViewContainerRef,
        protected elementRef: ElementRef,
        @Inject(PERMISSIONS_DIRECTIVE_DATA) @Optional() protected _permissionsData: IPermissionsDirectiveData,
        @Inject(Renderer2) protected _renderer2: Renderer2,
        @Optional() @Inject(ControlContainer) protected _controlContainer: ControlContainer,
        protected injector: Injector) {
        this._initTemplateRef();
    }

    public ngAfterViewInit() {
        this._permissionsService.permissionsChange$
            .pipe(
                debounceTime(50),
                tap(() => this.checkAccess()),
                untilDestroyed(this)
            ).subscribe();
    }

    protected grantAccess() {
        this.clearView();
        this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

    protected rejectAccess() {
        this.clearView();
    }

    clearView() {
        if (this.viewContainerRef) {
            this.viewContainerRef.clear();
        }
    }

    protected checkAccess() {
        const hasPermission = this._hasPermission();

        if (hasPermission === this._isAccessGranted) return;

        if (hasPermission) {
            this._isAccessGranted = true;
            this.grantAccess();
        } else {
            this._isAccessGranted = false;
            this.rejectAccess();
        }
    }

    protected _hasPermission() {
        return this.actions.every(action =>
            this._permissionsService && this._permissionsService.hasPermissions(action, this.permissionsData)
        );
    }

    // if template ref is provided in the constructor angular consider directive and it's child directives as structural
    protected _initTemplateRef() {
        this.templateRef = this.injector.get(TemplateRef, null);
    }

    ngOnDestroy() {
        // need for until destroy operator
    }
}

@Directive({
    selector: '[hasPermission]',
})
export class PermissionDirective extends PermissionsDirective {
    @Input('hasPermission')
    public set hasPermissions(actions: PermissionActionType | PermissionActionType[]) {
        this._actions = Array.isArray(actions) ? actions : [actions];
        this.checkAccess();
    }

    protected _hasPermission(): boolean {
        return this.actions.some(action =>
            this._permissionsService && this._permissionsService.hasPermissions(action, this.permissionsData));
    }
}

@Directive({
    selector: '[noForbiddenPermission]',
})
export class PermissionNoForbiddenDirective extends PermissionsDirective {
    @Input('noForbiddenPermission')
    public set hasPermissions(actions: PermissionActionType | PermissionActionType[]) {
        this._actions = Array.isArray(actions) ? actions : [actions];
        this.checkAccess();
    }

    protected _hasPermission(): boolean {
        return this.actions.some(action =>
            this._permissionsService && this._permissionsService.isNotForbidden(action));
    }
}


@Directive({
    selector: '[hasNoPermission]',
})
export class NoPermissionDirective extends PermissionsDirective {
    @Input()
    protected set hasNoPermission(value: PermissionActionType | PermissionActionType[]) {
        this.hasPermissions = value;
    }

    protected _hasPermission(): boolean {
        return this.actions.some(action => !this._permissionsService.hasPermissions(action, this.permissionsData));
    }
}
