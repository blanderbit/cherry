import { Translate } from 'translate';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './register/registration.component';
import { AuthRouting } from './auth.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HttpClientModule } from '@angular/common/http';
import { LoaderModule } from 'loader';
import { FormControlModule } from 'form-control';
import { AuthComponent } from './auth.component';
import { CommonAuthModule } from './common-auth/common-auth.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CheckboxModule } from '../ui/checkbox/checkbox.module';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { DialogModule } from '../ui/dialogs/dialog/dialog.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthLoaderModule } from './auth-loader/auth-loader.module';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { CustomDirectivesModule } from '../custom-directives/custom-directives.module';
import { SelectCompanyComponent } from './select-company/select-company.component';
import { AccountWasCreatedPlaceholderComponent } from './account-was-created-placeholder/account-was-created-placeholder.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ExpiredLinkModule } from './expired-link/expired-link.module';
import { CreateAccountResolver } from './create-account.resolver';
import { AuthService } from './auth.service';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { CompanyLogoModule } from '../companies/company-logo/company-logo.module';


@NgModule({
    declarations: [
        LoginComponent,
        RegistrationComponent,
        ForgotPasswordComponent,
        AuthComponent,
        LoginDialogComponent,
        VerifyEmailComponent,
        ResetPasswordComponent,
        AuthErrorComponent,
        SelectCompanyComponent,
        AccountWasCreatedPlaceholderComponent,
        CreateCompanyComponent,
        CreateAccountComponent,
        AccessDeniedComponent,
    ],
  imports: [
    CommonModule,
    AuthRouting,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoaderModule,
    FormControlModule,
    Translate.localize('login'),
    CommonAuthModule,
    AuthLoaderModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CheckboxModule,
    DialogModule,
    CustomDirectivesModule,
    ExpiredLinkModule,
    CompanyLogoModule,
  ],
    exports: [],
    entryComponents: [
        LoginDialogComponent,
    ],
    providers: [
        AuthService,
        CreateAccountResolver,
    ]
})
export class AuthModule {
}
