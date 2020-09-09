import { NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StateTransferInitializerModule } from '@nguniversal/common';
import { BrowserFileModule } from 'platform-file-loader';
import { BrowserCookieModule } from 'cookie-storage';

// the Request object only lives on the server
export function getRequest(): any {
    return {headers: {cookie: document.cookie}};
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppModule,
        StateTransferInitializerModule,
        BrowserTransferStateModule,
        ServiceWorkerModule.register('./ngsw-worker.js', {enabled: false}),
        BrowserFileModule.forRoot({root: './'}),
        BrowserCookieModule.forRoot()
    ],
    providers: [
        {
            // The server provides these in main.server
            provide: REQUEST,
            useFactory: getRequest,
        },
        {
            provide: 'ORIGIN_URL',
            useValue: location.origin,
        },
    ],
})
export class AppBrowserModule {
    constructor(private transferState: TransferState) {
        const store = (<any>transferState).store;

        setTimeout(() => {
            // tslint:disable-next-line:forin
            for (const key in store) {
                transferState.remove(key as any);
            }

            console.log('Transfer state cleared');
        }, 3000);
    }
}
