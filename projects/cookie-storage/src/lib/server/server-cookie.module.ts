import { ModuleWithProviders, NgModule } from '@angular/core';
import { CookieBackendService, CookieModule, CookieService, TransferHttpModule } from '@gorniv/ngx-universal';
import { CookieStorage } from '../cookie.storage';

@NgModule({
    imports: [
        CookieModule.forRoot(),
        TransferHttpModule,
    ],
    exports: [
        CookieModule,
        TransferHttpModule,
    ],
})
export class ServerCookieModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServerCookieModule,
            providers: [
                CookieStorage,
                {
                    provide: CookieService,
                    useClass: CookieBackendService,
                },
            ],
        };
    }
}
