import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// components
import {
    AppCerriDatepickerComponent,
    CerriCalendarComponent,
    CerriDatepickerCalendarComponent,
    DropdownComponent
} from './components';
// directives
import { ClickOutsideDirective, TextReplaceDirective } from './directives';
import {
    AuthService,
    BaseUrlService,
    GlobalErrorHandlerService,
    HttpWrapperService,
    SnackBarService
} from './services';
import { LocalStorageService } from './services/local-storage.service';
import { SpinnerService } from './services/spinner.service';
import { SidebarModule } from '../../../ui/sidebar/sidebar.module';

@NgModule({
    declarations: [
        TextReplaceDirective,
        ClickOutsideDirective,
        AppCerriDatepickerComponent,
        CerriDatepickerCalendarComponent,
        CerriCalendarComponent,
        DropdownComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        SidebarModule,
    ],
    exports: [
        TextReplaceDirective,
        ClickOutsideDirective,
        NgbModule,
        AppCerriDatepickerComponent,
        CerriDatepickerCalendarComponent,
        DropdownComponent
    ],
    providers: [
        SnackBarService,
        HttpWrapperService,
        BaseUrlService,
        AuthService,
        GlobalErrorHandlerService,
        LocalStorageService,
        SpinnerService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
