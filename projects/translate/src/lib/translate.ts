import { Injector, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MissingTranslationHandler,
    TranslateLoader,
    TranslateModule,
    TranslateService as NGXTranslateService
} from '@ngx-translate/core';
import { TranslateService } from './translate.service';
import { MODULE_PREFIX, ModuleTranslateLoader } from './module-translate.loader';
import { AppMissingTranslationHandler } from './app-missing-translation.handler';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { TranslateAlias, translateServiceFactory } from './translate-service.factory';

export const translateFactory = translateServiceFactory();

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: ModuleTranslateLoader,
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: AppMissingTranslationHandler,
            },
        }),
    ],
    exports: [
        TranslateModule,
    ],
})
export class Translate {
    static forRoot(module: string): ModuleWithProviders {
        return {
            ngModule: Translate,
            providers: [
                TranslateService,
                NotifierService,
                {
                    provide: MODULE_PREFIX,
                    useValue: module,
                },
            ],
        };
    }

    static localize(module: string): ModuleWithProviders {
        return {
            ngModule: Translate,
            providers: [
                {
                    provide: MODULE_PREFIX,
                    useValue: module,
                },
                NotifierService,
            ],
        };
    }

    static localizeComponent(module: string, provider?): Provider[] {
        return [
            {
                provide: provider || NGXTranslateService,
                useFactory: translateFactory,
                deps: [Injector, TranslateAlias]
            },
            {
                provide: TranslateAlias,
                useValue: module
            },
            NotifierService,
        ];
    }

    constructor(private _ngxTranslateService: NGXTranslateService, private _translateService: TranslateService) {
        _translateService.register(_ngxTranslateService);
    }
}
