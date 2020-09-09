export enum AuthRoutes {
    Auth = 'auth',
    SignUp = 'sign-up',
    Login = 'login',
    CreateAccount = 'create-account',
    CreateCompany = 'create-company',
    ForgotPassword = 'forgot-password',
    ResetPassword = 'reset-password',
    SelectCompany = 'select-company',
    Error = 'error',
    AccessDenied = 'access-denied',
}

export const loginUrl = `/${AuthRoutes.Auth}/${AuthRoutes.Login}`;
export const forgotPasswordUrl = `/${AuthRoutes.Auth}/${AuthRoutes.ForgotPassword}`;
export const signUpUrl = `/${AuthRoutes.Auth}/${AuthRoutes.SignUp}`;
export const authErrorUrl = `/${AuthRoutes.Auth}/${AuthRoutes.Error}`;
export const createCompanyUrl = `/${AuthRoutes.Auth}/${AuthRoutes.CreateCompany}`;
export const selectCompanyUrl = `/${AuthRoutes.Auth}/${AuthRoutes.SelectCompany}`;
export const termsOfUseUrl = 'https://www.cerri.com/legal/terms-of-use/';
export const privacyPolicyUrl = 'https://www.cerri.com/legal/privacy/';
export const aboutCerriUrl = 'https://www.cerri.com/about/';
export const subscriptionAgreementUrl = 'https://www.cerri.com/terms/';

