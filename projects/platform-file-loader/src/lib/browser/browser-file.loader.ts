import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { FileLoader } from '../file.loader';
import { ROOT } from '../root';

@Injectable()
export class BrowserFileLoader extends FileLoader {
    constructor(transferState: TransferState,
                @Inject(ROOT) protected root: string,
                protected http: HttpClient) {
        super(transferState, root);
    }

    loadFile(file: string): Observable<Object> {
        const data: any = this.transferState.get(makeStateKey(file), null);

        return data ? of(data) : this.http.get(this.getPath(file));
    }
}

