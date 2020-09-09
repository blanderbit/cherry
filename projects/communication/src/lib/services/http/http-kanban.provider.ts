import { CommunicationConfig } from 'communication';
import { IKanbanBoard } from 'src/app/pages/kanban/project-kanban-board/project-kanban-board.component';
import { HttpProvider } from './http.provider';
import { KanbanProvider } from '../common/kanban.provider';

export class HttpKanbanProvider extends HttpProvider<IKanbanBoard> implements KanbanProvider {
    _getURL(config: CommunicationConfig) {
        return `${config.http.kanban}/boards`;
    }
}
