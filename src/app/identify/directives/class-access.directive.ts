import { Directive, Input } from '@angular/core';
import { EditPermissionDirective } from 'permissions';


@Directive({
    selector: `[classAccess]`,
})
export class ClassAccessDirective extends EditPermissionDirective {
    @Input() classByRole = 'pointer-events-none';

    rejectAccess() {
        this._renderer2.addClass(this.elementRef.nativeElement, this.classByRole);
    }

    grantAccess() {
        this._renderer2 .removeClass(this.elementRef.nativeElement, this.classByRole);
    }
}

