import { RealtimeProvider } from '../common/realtime.provider';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

export class FakeRealtimeProvider extends RealtimeProvider {
    private interval;

    init(): Observable<any> {
        super.init();
        this.interval = setInterval(() => {
            this.handleMessage({type: 'test', payload: 'ppp'});
        }, 2000);

        return of(null);
    }

    destroy(): Observable<any> {
        clearInterval(this.interval);
        return of(null);
    }
}
