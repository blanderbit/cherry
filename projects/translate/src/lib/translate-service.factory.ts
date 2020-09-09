import { Inject, InjectionToken, Injector, Optional } from '@angular/core';
import {
    FakeMissingTranslationHandler,
    TranslateDefaultParser,
    TranslateFakeCompiler,
    TranslateService as NgxTranslateService,
    TranslateStore
} from '@ngx-translate/core';
import { ModuleTranslateLoader } from './module-translate.loader';
import { TranslateService } from './translate.service';
import { FileLoader } from 'platform-file-loader';

export const TranslateAlias = new InjectionToken<string>('TranslateAlias');

export function translateServiceFactory(translateAlias?: string) {
    return (injector: Injector, translateAliasOrLoader = translateAlias) => {
        const services = injector.get(TranslateService);

        if (!translateAliasOrLoader)
            translateAliasOrLoader = injector.get(TranslateAlias);

        if (services.get(translateAliasOrLoader))
            return services.get(translateAliasOrLoader);

        const translateService = new NgxTranslateService(
            new TranslateStore(),
            typeof translateAliasOrLoader === 'string' ?
                new ModuleTranslateLoader(translateAliasOrLoader, injector.get(FileLoader)) :
                translateAliasOrLoader,
            new TranslateFakeCompiler(),
            new TranslateDefaultParser(),
            new FakeMissingTranslationHandler(),
            true,
            true
        );

        services.register(translateService);
        return translateService;
    };
}
