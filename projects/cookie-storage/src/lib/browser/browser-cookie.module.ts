import { ModuleWithProviders, NgModule } from '@angular/core';
import { CookieModule, CookieService, TransferHttpModule } from '@gorniv/ngx-universal';
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
export class BrowserCookieModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BrowserCookieModule,
            providers: [
                CookieService,
                CookieStorage,
            ],
        };
    }
}
