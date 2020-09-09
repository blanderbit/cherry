import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { CreateAccountResolver, ICreateAccountResolverData } from './create-account.resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './register/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRoutes } from './auth.routes';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { SelectCompanyComponent } from './select-company/select-company.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: AuthRoutes.Login,
                component: LoginComponent,
            },
            {
                path: AuthRoutes.SignUp,
                component: RegistrationComponent,
            },
            {
                path: AuthRoutes.SelectCompany,
                component: SelectCompanyComponent,
            },
            {
                path: AuthRoutes.CreateAccount,
                component: CreateAccountComponent,
                resolve: {
                    data: CreateAccountResolver,
                } as ICreateAccountResolverData<Type<CreateAccountResolver>>,
            },
            {
                path: AuthRoutes.CreateCompany,
                component: CreateCompanyComponent,
            },
            {
                path: AuthRoutes.ForgotPassword,
                component: ForgotPasswordComponent,
            },
            {
                path: AuthRoutes.ResetPassword,
                component: ResetPasswordComponent,
            },
            {
                path: AuthRoutes.Error,
                component: AuthErrorComponent
            },
            {
                path: AuthRoutes.AccessDenied,
                component: AccessDeniedComponent,
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRouting {
}
