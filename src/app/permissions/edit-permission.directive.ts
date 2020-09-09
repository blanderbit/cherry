import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { IPermissionsDirectiveData, PermissionsDirective } from './permissions.directive';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { PermissionActionType } from 'communication';

export type DisableCondition = boolean;

@Directive({
    selector: `[hasEditPermission]`,
})
export class EditPermissionDirective extends PermissionsDirective {
    private _disabled: boolean;
    @Input() formControlName;
    @Input() formControl: FormControl;

    @Input() set disableIf(value: boolean) {
        this._disabled = value;
            this.checkAccess();
    }

    get disabled() {
        return this._disabled;
    }

    @Input() set hasEditPermission(value: PermissionActionType | PermissionActionType[]) {
        this.hasPermissions = value;
    }

    get form() {
        return this._controlContainer && (<FormGroupDirective>this._controlContainer).form;
    }

    get control() {
        if (this.formControl) {
            return this.formControl;
        } else if (this._controlContainer && this.formControlName) {
            return this.form.controls[this.formControlName];
        } else {
            return this.form;
        }
    }

    get nativeElement() {
        return this.viewContainerRef.element.nativeElement;
    }

    grantAccess() {
        const control = this.control;

        if (control) {
            this.control.enable({emitEvent: false});
        } else {
            this._renderer2.removeAttribute(this.nativeElement, 'disabled');
        }
    }

    rejectAccess() {
        const control = this.control;

        if (control) {
            this.control.disable({emitEvent: false});
        } else {
            this._renderer2.setAttribute(this.nativeElement, 'disabled', 'true');
        }
    }

    protected _hasPermission(): boolean {
        console.log('DISABLED', !this.disabled, super._hasPermission());
        console.log('ACTION', this._actions, !this.disabled && super._hasPermission());
        return !this.disabled && super._hasPermission();
    }
}

