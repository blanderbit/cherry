import { FakeProvider } from './fake.provider';
import { getEnumKeys } from '../../../../../../src/app/components/getEnumKeys';
import { LocationsProvider } from '../common/locations.provider';
import { Country } from '../../fake-data/country.enum';
import { ILocation } from '../../models/location';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Helpers } from '../../../../../../src/app/helpers';
import { CountriesProvider } from '../common/countries.provider';
import { ICountry } from '../../models/country';
import { IKanbanBoard, IKanbanColumn } from 'src/app/pages/kanban/project-kanban-board/project-kanban-board.component';
import { KanbanProvider } from '../common/kanban.provider';
import { TaskStatus, ProjectStatus, ProjectType } from '../../models';

export abstract class FakeKanbanProvider extends FakeProvider<IKanbanBoard> implements KanbanProvider {
    protected _getItems(params = {}): IKanbanBoard[] {
        return [
            {
                id: 14,
                name: 'Project-X',
                creatorId: 32,
                status: ProjectStatus.InProgress,
                members: members,
                columns: columns,
                type: ProjectType.Agile,
            }
        ];
    }
}

const members = [
    { 'id': 32, 'roleId': 88, 'removed': false },
    { 'id': 33, 'roleId': 90, 'removed': false },
    { 'id': 70, 'roleId': null, 'removed': false },
    { 'id': 77, 'roleId': null, 'removed': false },
    { 'id': 79, 'roleId': 90, 'removed': true },
    { 'id': 93, 'roleId': 90, 'removed': false },
    { 'id': 124, 'roleId': 90, 'removed': false }
];

const columns: IKanbanColumn[] = [
    {
        id: 55,
        name: 'First Column',
        plannedTime: 0,
        trackedTime: 0,
        taskCards: [
            {
                id: 56,
                name: 'Kanban Task',
                priorityId: 1,
                currentStartDate: '22-05-2020',
                currentEndDate: '22-05-2020',
                actualTime: 0,
                status: TaskStatus.InProgress,
                plannedTime: 0,
                projectId: 14,
            },
            {
                id: 57,
                name: 'Second Kanban Task',
                priorityId: 1,
                currentStartDate: '22-05-2020',
                currentEndDate: '22-05-2020',
                actualTime: 10,
                status: TaskStatus.InProgress,
                plannedTime: 100,
                projectId: 14,
            }
        ],
    },
    {
        id: 24,
        name: 'Second Column',
        plannedTime: 0,
        trackedTime: 0,
        taskCards: [
            {
                id: 123,
                name: 'Column 2 Kanban Task',
                priorityId: 1,
                currentStartDate: '22-05-2020',
                currentEndDate: '22-05-2020',
                actualTime: 20,
                plannedTime: 220,
                status: TaskStatus.InProgress,
                projectId: 14,
            },
            {
                id: 124,
                name: 'Column 2 Kanban Task',
                priorityId: 1,
                currentStartDate: '22-05-2020',
                currentEndDate: '22-05-2020',
                actualTime: 0,
                status: TaskStatus.InProgress,
                plannedTime: 0,
                projectId: 14,
            }
        ],
    }
];
