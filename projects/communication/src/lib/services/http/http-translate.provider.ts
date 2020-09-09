import { HttpProvider } from './http.provider';
import { CommunicationConfig, ExcludeId, ITranslateDescription } from 'communication';
import { Observable, throwError } from 'rxjs';

export class HttpTranslateProvider extends HttpProvider<ITranslateDescription>  {
    protected _getURL(config: CommunicationConfig): string {
        return config.http.translate;
    }

    createItem(item: ExcludeId<any>, options?: any): Observable<ITranslateDescription> {
        return throwError('Method don\'t allowed');
    }

    deleteItem(id: number | string): Observable<ITranslateDescription> {
        return throwError('Method don\'t allowed');
    }
}
