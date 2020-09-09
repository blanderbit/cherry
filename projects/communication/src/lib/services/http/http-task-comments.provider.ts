import { HttpProvider } from './http.provider';
import {
    CommunicationConfig,
    ExcludeId,
    IActionConfig,
    ITaskComment,
} from 'communication';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RealtimeAction, RealtimeSuffix } from '../common/realtime.provider';


import { TaskCommentsProvider } from '../common/task-comments.provider';

const Suffix = 'comments';

export class HttpTaskCommentsProvider extends HttpProvider<ITaskComment> implements TaskCommentsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return config.http.tasks;
    }

    protected _getType(): string {
        return RealtimeSuffix.TaskComment;
    }

    createItem(item: ExcludeId<ITaskComment>, options?: any): Observable<any> {
        return super.createItem(item, options)
            .pipe(
                // TODO: Rename RealtimeAction.Added to RealtimeAction.Created after changed on BE
                tap(data => this._emitRealtime(data, RealtimeAction.Added)),
            );
    }

    getDeleteActions(): (string | IActionConfig)[] {
        return super.getDeleteActions();
    }

    getUpdatesActions(): (string | IActionConfig)[] {
        return [
            ...super.getUpdatesActions(),
        ];
    }

    getCreateActions(): (string | IActionConfig)[] {
        return [
            ...super.getCreateActions(),
            'Added'
        ];
    }

    protected _getRESTURL(id?): string {
        return this._concatUrl(Suffix, id);
    }
}
