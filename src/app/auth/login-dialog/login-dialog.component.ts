import { Component, Input, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss', '../auth.scss']
})
export class LoginDialogComponent extends LoginComponent implements OnInit {
    @Input() email: string;

    ngOnInit() {
        super.ngOnInit();
        this.controls.email.setValue(this.email);
    }
}
