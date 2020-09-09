import { ILoginData } from './../identify/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutes } from './../pages/dashboard/dashboard.routes';
import { NavigationExtras } from '@angular/router';
import { FormComponent } from 'components';
import { IIdObject } from 'communication';
import { AuthRoutes as AuthRoute } from './auth.routes';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

export abstract class AuthFormComponent<T extends IIdObject> extends FormComponent<T> {
    protected _ngbModal: NgbModal;

    get ngbModal() {
        if (this._ngbModal) {
            return this._ngbModal;
        }

        console.error('Please provide an instance of NgbModal');
    }

    redirectToErrorPage(): Promise<boolean> {
        return this.router.navigate(['/', AuthRoute.Auth, AuthRoute.Error], {
            relativeTo: this.route,
        }).then();
    }

    resetControlStatus(event: Event) {
        const controlName = (event.target as any).attributes.formControlName.value;

        this.controls[controlName].markAsUntouched();
        this.controls[controlName].markAsPristine();
        this.controls[controlName].updateValueAndValidity();
    }

    apply(e?: Event) {
        this.form.markAsTouched();
        this.form.updateValueAndValidity();
        super.apply(e);
    }

    authNavigate(route: AuthRoute, options: NavigationExtras = {}) {
        this.router.navigate(['/', AuthRoute.Auth, route], options).then();
    }

    navigateToDashboard(): Promise<boolean> {
        return this.router.navigate(['/', DashboardRoutes.HOME]);
    }

    redirectToAccessDeniedPage() {
        this.router.navigate([this.redirectToAccessDeniedPage()]);
    }
}
