import { CommunicationConfig } from 'communication';
import { HttpProvider } from 'projects/communication/src/lib/services/http/http.provider';
import { Observable } from 'rxjs';
import { IDeliverable, TaskFields } from '../../models/tasks/taskOrDeliverable';
import * as _ from 'underscore';

export class HttpDeliverableProvider extends HttpProvider<IDeliverable> {
    protected _getURL(config: CommunicationConfig): string {
        return `${ config.http.tasks }/deliverables`;
    }

    patchItem(item: Partial<IDeliverable>, field?: string): Observable<Partial<IDeliverable>> {
        const dto = _.pick(item, field as any);

        if (field === TaskFields.StartDate || field === TaskFields.EndDate)
            field = 'dates';

        return this._http.put(this._concatUrl(item.id, field), dto);
    }

    protected _updateProperty(id, property, value) {
        if (property === 'endDate')
            property = 'date';

        return this._http.put(this._concatUrl(id, property), {[property]: value});
    }
}
