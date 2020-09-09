import { NgModule, ModuleWithProviders, ErrorHandler, Provider } from '@angular/core';
import { SentryErrorHandler } from './sentry.service';
import { SentryConfig } from './config';

@NgModule({})
export class SentryModule {
    static forRoot(configToken: Provider): ModuleWithProviders {
        return {
            ngModule: SentryModule,
            providers: [
                {
                    provide: SentryConfig,
                    useExisting: configToken,
                },
                {
                    provide: ErrorHandler,
                    useClass: SentryErrorHandler,
                },
            ],
        };
    }
}
