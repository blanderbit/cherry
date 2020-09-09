import { FakeProvider } from './fake.provider';
import { Provider } from '../common/provider';
import { ITask } from '../../models/tasks/taskOrDeliverable';

export class FakeTasksProvider extends FakeProvider<ITask> implements Provider<ITask> {
    protected _store: ITask[];

    protected _getItems(): ITask[] {
        return this._store;
    }
}
