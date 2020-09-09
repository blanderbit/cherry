import { Observable, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { FileLoader } from '../file.loader';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import * as fs from 'fs';
import { ROOT } from '../root';

@Injectable()
export class ServerFileLoader extends FileLoader {

    constructor(transferState: TransferState, @Inject(ROOT) root: string) {
        super(transferState, root);
    }

    loadFile(file: string): Observable<any> {
        const data = JSON.parse(<any>fs.readFileSync(this.getPath(file)));

        this.transferState.set(makeStateKey(file), data);

        return of(data);
    }
}
