import { throwError } from 'rxjs';
import { IAssignment } from '../../models/assignments/assignment';
import { Provider } from './provider';
import { IKanbanColumn } from 'src/app/pages/kanban/project-kanban-board/project-kanban-board.component';

export abstract class KanbanColumnsProvider extends Provider<IKanbanColumn> {
}

