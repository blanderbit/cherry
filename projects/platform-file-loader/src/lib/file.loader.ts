import { Observable } from 'rxjs';
import { Inject } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ROOT } from './root';

export abstract class FileLoader {
    constructor(@Inject(TransferState) protected transferState: TransferState,
                @Inject(ROOT) protected root: string) {

    }

    abstract loadFile(path: string): Observable<Object>;

    getPath(...args: string[]) {
        console.log(args.join('/'));
        return `${this.root}${args.join('/')}`;
    }
}
