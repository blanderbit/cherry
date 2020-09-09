import { ModuleWithProviders, NgModule } from '@angular/core';
import { MetaGuard, MetaLoader, MetaModule, MetaService, MetaSettings } from '@ngx-meta/core';
import { AppMetaLoader, MetaSettingsProvider } from './app-meta.loader';
import { TranslateService as NGXTranslateService } from '@ngx-translate/core';

export interface MetaConfig {
    title?: string;
    description?: string;
    keywords?: string;

    [key: string]: string | undefined;
}

export function getMetaProviders(settings?: Partial<MetaSettings>) {
    return [
        {
            provide: MetaSettingsProvider,
            useValue: settings,
        },
        {
            provide: MetaLoader,
            useClass: AppMetaLoader,
            deps: [NGXTranslateService, MetaSettingsProvider],
        },
        MetaService,
        MetaGuard,
    ];
}


@NgModule()
export class Meta {
    static forRoot(settings?: Partial<MetaSettings>): ModuleWithProviders {
        return {
            ngModule: MetaModule,
            providers: getMetaProviders(settings),
        };
    }

    static forChild(config?: MetaConfig): ModuleWithProviders {
        return {
            ngModule: Meta,
            providers: getMetaProviders({ defaults: config }),
        };
    }
}
