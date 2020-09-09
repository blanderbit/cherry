import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { TimeAppRoutes } from './timeapp.routing';
import { TimeAppComponent } from './timeapp.component';
// modules
import { SharedModule } from './_shared/shared.module';
// services
import { SnackBarService } from './_shared/services';
import { Translate } from 'translate';
import { Meta } from 'meta';

@NgModule({
    declarations: [
        TimeAppComponent
    ],
    imports: [
        TimeAppRoutes,
        // HttpClientModule,
        SharedModule,
        Translate.localize('track'),
        Meta.forChild(),
    ],
    exports: [
        SharedModule
    ],
    providers: [
        /*{
          provide: ErrorHandler,
          useClass: GlobalErrorHandlerService
        }*/

        SnackBarService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimeAppModule {
}
