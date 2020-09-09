import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from 'translate';

const localeSubject = new BehaviorSubject('en-US');

enum LanguageLocaleMap {
    ua = 'uk',
    en = 'en',
}

const DEFAULT_LOCALE = LanguageLocaleMap.en;

@Injectable()
export class LocalizationService {
    static locale$ = localeSubject.asObservable();

    static get locale(): string {
        return localeSubject.value;
    }

    constructor(private translateService: TranslateService) {
        const language = this.translateService.language && this.translateService.language.toLowerCase();
        const locale = LanguageLocaleMap[language] || DEFAULT_LOCALE;

        localeSubject.next(locale);
    }

    changeLang(langCode: string) {
        this.translateService.changeLang(langCode);

        localeSubject.next(langCode);
    }
}
