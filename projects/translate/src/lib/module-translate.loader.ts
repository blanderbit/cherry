import { TranslateLoader } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { Inject, InjectionToken, Injectable } from '@angular/core';
import { getLocalizationFile } from './file';
import { FileLoader } from 'platform-file-loader';

export const MODULE_PREFIX = new InjectionToken<string>('MODULE_PREFIX');

@Injectable()
export class ModuleTranslateLoader implements TranslateLoader {
    constructor(@Inject(MODULE_PREFIX) public module: string,
                @Inject(FileLoader) private fileLoader: FileLoader) {

    }

    getTranslation(lang: string): Observable<any> {
        if (!this.module)
            return throwError('Module should be provided');

        return this.fileLoader.loadFile(getLocalizationFile(lang, this.module));
    }
}



