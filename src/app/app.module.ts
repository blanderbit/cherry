import { APP_INITIALIZER, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { CommunicationModule } from 'communication';
import { Meta } from 'meta';
import { ConfigModule } from 'config';
import { AppConfig } from './app.config';
import { NotifierModule, NotifierService } from 'notifier';
import { TranslateService } from 'translate';
import { environment } from 'environment';
import { IdentifyModule } from './identify/identify.module';
import { DashboardModule } from 'src/app/pages/dashboard/dashboard.module';
import { TextFieldModule } from '@angular/cdk/text-field';
import { isPlatformServer, registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { PermissionsModule } from 'permissions';
import { LocalizationService } from './localization.service';
import { LocalDatePipe } from 'date';

export function initLanguage(translateService: TranslateService): Function {
    return (): Promise<any> => translateService.initLanguage();
}

registerLocaleData(localeUk);

console.log('environment.config', environment.config);

@NgModule({
    imports: [
        BrowserModule.withServerTransition({appId: 'platform-v1'}),
        Meta.forRoot(),
        TransferHttpCacheModule,
        HttpClientModule,
        TextFieldModule,
        AppRoutes,
        BrowserAnimationsModule,
        // Translate.localize('main'),
        CommunicationModule.forRoot(AppConfig),
        // SentryModule.forRoot(AppConfig),
        /**
         * config/config.json for server configuration
         * todo: check environment file for server build
         * */
        ConfigModule.configure({
            path: environment.config || 'config/config.json',
            configProvider: AppConfig,
        }),
        NotifierModule.forRoot(),
        DashboardModule,
        IdentifyModule.forRoot(),
        PermissionsModule.forRoot(),
    ],
    declarations: [
        AppComponent,

    ],
    providers: [
        AppConfig,
        LocalDatePipe,
        LocalizationService,
        {
            provide: APP_INITIALIZER,
            useFactory: initLanguage,
            multi: true,
            deps: [TranslateService],
        },
    ],
    exports: [],
})

export class AppModule {
    constructor(notifier: NotifierService, @Inject(PLATFORM_ID) private _platformId: Object) {
        try {
            if (!isPlatformServer(this._platformId) && navigator && navigator.serviceWorker)
                navigator.serviceWorker.getRegistrations().then(
                    function (registrations) {
                        for (const registration of registrations) {

                            registration.unregister()
                                .then(function () {
                                    const clients = (self as any).clients;
                                    notifier.showWarning(`clients, ${clients}`);

                                    if (clients)
                                        return clients.matchAll() || [];
                                })
                                .then(function (clients) {
                                    notifier.showWarning(`then clients, ${clients}`);

                                    clients.forEach(client => {

                                        if (client.url && 'navigate' in client) {

                                            client.navigate(client.url);

                                        }
                                    });
                                }).then(() => notifier.showSuccess(`registrations removed successfully`));
                        }
                    });
        } catch (e) {
            console.log(e);
        }
    }
}
