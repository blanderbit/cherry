import { CommunicationConfig } from './../../communication.config';
import { throwError } from 'rxjs';
import { IKanbanColumn } from 'src/app/pages/kanban/project-kanban-board/project-kanban-board.component';
import { KanbanColumnsProvider } from '../common/kanban-columns.provider';
import { HttpProvider } from './http.provider';
import { RealtimeSuffix } from '../common/realtime.provider';

export class HttpKanbanColumnsProvider extends HttpProvider<IKanbanColumn> implements KanbanColumnsProvider {
    protected _getURL(config: CommunicationConfig) {
        return `${config.http.kanban}/columns`;
    }

    protected _getType(): string {
        return RealtimeSuffix.KanbanColumns;
    }

    getItemById() {
        return throwError('Not exist');
    }

    getItems() {
        return throwError('Not exist');
    }

    changeOrder(params: IChangeKanbanColumnOrderParams) {
        return this._http.put(this._concatUrl(`${params.id}/order`), { params });
    }
}

export interface IChangeKanbanColumnOrderParams {
    previousOrder: number;
    newOrder: number;
    id: number;
}
