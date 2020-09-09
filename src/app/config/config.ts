import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export class Config {
    _$config = new ReplaySubject<this>(1);
    public config$ = this._$config.asObservable();

    apply(config: any) {
        console.log('config', JSON.stringify(config));
        Object.assign(this, config);
        this._$config.next(this);
    }

    getConfig(): Observable<Config> {
        return this._$config.pipe(filter(Boolean)) as Observable<Config>;
    }
}
