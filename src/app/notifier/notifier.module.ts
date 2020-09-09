import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Translate } from 'translate';
import { ErrorTranslateService } from './error-translate.service';
import { CustomToastComponent } from './custom-toastr/custom-toast.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        CustomToastComponent
    ],
    imports: [
        CommonModule,
        ToastrModule.forRoot({
            toastComponent: CustomToastComponent,
            positionClass: 'toast-bottom-right',
        }),
        BrowserAnimationsModule,
        TranslateModule,
    ],
    entryComponents: [
        CustomToastComponent
    ],
    exports: [
        ToastrModule,
        BrowserAnimationsModule,
    ],
})
export class NotifierModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NotifierModule,
            providers: Translate.localizeComponent('error-codes', ErrorTranslateService),
        };
    }

}
