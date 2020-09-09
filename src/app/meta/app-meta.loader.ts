import { Inject, Injectable } from '@angular/core';
import { MetaSettings, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { TranslateService as NGXTranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class MetaSettingsProvider {
    static merge(settings: Partial<MetaSettings>): MetaSettings {
        const defaults = settings.defaults;
        delete settings.defaults;

        return {
            pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
            pageTitleSeparator: ' | ',
            applicationName: null,
            defaults: {
                title: 'meta.title',
                description: 'meta.description',
                'og:site_name': 'Web Application',
                'og:type': 'website',
                'og:locale': 'en-US',
                ...defaults,
            },
            ...settings,
        };
    }
}

@Injectable()
export class AppMetaLoader extends MetaStaticLoader {
    constructor(translate: NGXTranslateService, @Inject(MetaSettingsProvider) settings: Partial<MetaSettings>) {
        super(MetaSettingsProvider.merge({
            callback: (key: string): Observable<string | Object> => translate.get(key),
            ...settings,
        }));
    }
}
