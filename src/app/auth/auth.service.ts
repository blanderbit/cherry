import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { ILoginData } from '../identify/profile.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { AuthRoutes } from './auth.routes';

@Injectable()
export class AuthService {
    static normalizeToken(token: string): string {
        return encodeURI(token).replace(/%20/g, '+');
    }

    constructor(
        private ngbModal: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    showLoginDialog(obj: Partial<ILoginData>) {
        const ref = this.ngbModal.open(LoginDialogComponent, {
            windowClass: 'login-dialog',
        });

        (ref.componentInstance as LoginDialogComponent).email = obj.userName;
    }

    redirectToAccessDeniedPage() {
        this.router.navigate(['/', AuthRoutes.Auth, AuthRoutes.AccessDenied]);
    }
}
