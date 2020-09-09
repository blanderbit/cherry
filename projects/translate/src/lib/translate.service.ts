import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateService as NGXTranslateService } from '@ngx-translate/core';
import { MetaService } from '@ngx-meta/core';
import { Observable, of } from 'rxjs';
import { ILang } from './translate.interface';
import { CookieStorage } from 'cookie-storage';


export const LANG_LIST: ILang[] = [
  {code: 'en', name: 'English', culture: 'en-US'},
  {code: 'ua', name: 'Українська', culture: 'uk-UA'},
];

const LANG_DEFAULT: ILang = LANG_LIST[0],
    STORAGE_LANG_NAME: string = 'langCode';

@Injectable({providedIn: 'root'})
export class TranslateService {
    language: string;

    private _services: NGXTranslateService[] = [];

    constructor(@Inject(PLATFORM_ID) private _platformId: Object,
                @Inject(DOCUMENT) private _document: any,
                @Inject(REQUEST) private _request: any,
                @Inject(MetaService) private _meta: MetaService,
                @Inject(REQUEST) private _req: any,
                @Inject(CookieStorage) private _appStorage: Storage) {
    }

    async initLanguage(): Promise<any> {
        const language: ILang = this._getLanguage();

        for (const service of this._services) {
            initService(service, language);
        }

        this._setLanguage(language);
    }

    private _getLanguage(): ILang {
        let language: ILang = this._getFindLang(this._appStorage.getItem(STORAGE_LANG_NAME));

        if (language)
            return language;


        if (isPlatformBrowser(this._platformId))
            language = this._getFindLang(getBrowserLang());

        if (isPlatformServer(this._platformId)) {
            try {
                const reqLangList: string[] = this._request.headers['accept-language']
                    .split(';')[0]
                    .split(',');

                language = LANG_LIST.find(
                    (lang: ILang) =>
                        reqLangList.indexOf(lang.code) !== -1 || reqLangList.indexOf(lang.culture) !== -1,
                );
            } catch (err) {
                language = LANG_DEFAULT;
            }
        }


        language = language || LANG_DEFAULT;
        this._appStorage.setItem(STORAGE_LANG_NAME, language.code); // todo
        return language;
    }

    private _getFindLang(code: string): ILang | null {
        return code ? LANG_LIST.find((lang: ILang) => lang.code === code) : null;
    }

    private _setLanguage({code, culture}: ILang): void {
        for (const service of this._services) {
            service.use(code);
        }

        this._meta.setTag('og:locale', culture);
        this._document.documentElement.lang = culture;
        this.language = code;
    }

    changeLang(code: string): void {
        const lang: ILang = this._getFindLang(code);
        if (!lang || lang.code === this.language) {
            return;
        }

        this._appStorage.setItem(STORAGE_LANG_NAME, lang.code);
        this._setLanguage(lang);
    }

    getLangList(): Observable<ILang[]> {
        return of(LANG_LIST);
    }

    register(translateService: NGXTranslateService) {
        this._services.push(translateService);

        const language: ILang = this._getLanguage();
        initService(translateService, language);

        translateService.use((language || LANG_DEFAULT).code).subscribe(() => null, console.error);
    }

    get(name: string) {
        return this._services.find(s => (s.currentLoader as any)._module === name);
    }
}

function initService(service: NGXTranslateService, language: ILang) {
    service.addLangs(LANG_LIST.map((lang: ILang) => lang.code));
    service.setDefaultLang((language || LANG_DEFAULT).code);
}

/**
 * Returns the language code name from the browser, e.g. "de"
 * source: @ngx-translate
 * @returns string
 */
function getBrowserLang() {
    const navigator: any = window && window.navigator;

    if (!navigator)
        return;

    const browserLang = navigator.language || navigator.browserLanguage || navigator.userLanguage;

    return normalizeBrowserLang(browserLang);
}


function normalizeBrowserLang(lang) {
    if (lang.indexOf('-') !== -1) {
        lang = lang.split('-')[0];
    }

    if (lang.indexOf('_') !== -1) {
        lang = lang.split('_')[0];
    }

    return lang;
}
