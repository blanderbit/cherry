import { Observable, of } from 'rxjs';
import { ExcludeId, Provider } from 'projects/communication/src/lib/services/common/provider';
import { IProject, ProjectType } from '../../models/projects/project';
import { ProjectGroup } from '../../models/projects/projects-group';
import { FakeProvider } from './fake.provider';
import { ProjectStatus } from '../../models/projects/project.status';

export class FakeProjectsProvider  extends FakeProvider<IProject> implements Provider<IProject>  {

    _projects: IProject[] = [
        {
            id: 1,
            // name: 'Unclassified',
            name: 'Task app Cerri platform',
            status: ProjectStatus.InProgress,
            projectGroup: ProjectGroup.track,
            startDate: new Date().getTime().toString(),
            endDate: new Date().getTime().toString(),
            lastModified: new Date().getTime(),
            creatorId: 1,
            members: [
                {
                    id: 1,
                    removed: false,
                    roleId: null,
                }
            ],
            type: ProjectType.Agile
        },
        {
            id: 2,
            // name: 'Unclassified',
            name: 'Task app Cerri platform',
            status: ProjectStatus.Draft,
            projectGroup: ProjectGroup.track,
            startDate: new Date().getTime().toString(),
            endDate: new Date().getTime().toString(),
            lastModified: new Date().getTime(),
            creatorId: 1,
            members: [
                {
                    id: 1,
                    removed: false,
                    roleId: null,
                }
            ],
            type: ProjectType.Agile
        },
        {
            id: 3,
            // name: 'Unclassified',
            name: 'Task app Cerri platform',
            status: ProjectStatus.Canceled,
            projectGroup: ProjectGroup.track,
            startDate: new Date().getTime().toString(),
            endDate: new Date().getTime().toString(),
            lastModified: new Date().getTime(),
            creatorId: 1,
            members: [
                {
                    id: 1,
                    removed: false,
                    roleId: null,
                }
            ],
            type: ProjectType.Agile
        },
        {
            id: 4,
            // name: 'Unclassisfied',
            name: 'Task app Cerri platform',
            status: ProjectStatus.Completed,
            projectGroup: ProjectGroup.track,
            startDate: new Date().getTime().toString(),
            endDate: new Date().getTime().toString(),
            lastModified: new Date().getTime(),
            creatorId: 1,
            members: [
                {
                    id: 1,
                    removed: false,
                    roleId: null,
                }
            ],
            type: ProjectType.Waterfall
        },
        {
            id: 5,
            // name: 'Design Work Q1',
            name: 'Task app Cerri platform',
            status: ProjectStatus.InProgress,
            projectGroup: ProjectGroup.actives,
            startDate: new Date().getTime().toString(),
            endDate: new Date().getTime().toString(),
            lastModified: new Date().getTime(),
            creatorId: 1,
            members: [
                {
                    id: 1,
                    removed: false,
                    roleId: null,
                }
            ],
            type: ProjectType.Waterfall
        },
        {
            id: 6,
            // name: 'Marketing',
            name: 'Task app Cerri platform',
            status: ProjectStatus.InProgress,
            projectGroup: ProjectGroup.favourites,
            startDate: new Date().getTime().toString(),
            endDate: new Date().getTime().toString(),
            lastModified: new Date().getTime(),
            creatorId: 1,
            members: [
                {
                    id: 1,
                    removed: false,
                    roleId: null,
                }
            ],
            type: ProjectType.Waterfall
        },
    ];

    _getItems() {
        return this._projects = [
            {
                id: 1,
                name: 'Unclassified',
                status: ProjectStatus.InProgress,
                projectGroup: ProjectGroup.track,
                startDate: new Date().getTime().toString(),
                endDate: new Date().getTime().toString(),
                lastModified: new Date().getTime(),
                creatorId: 1,
                members: [
                    {
                        id: 1,
                        removed: false,
                        roleId: null,
                    }
                ],
                type: ProjectType.Waterfall
            }
        ];
    }

    getItems(kind?): Observable<any> {
        if (kind && kind.ProjectsStatus) {

            if (kind === ProjectGroup.all) {
                return of(this._projects);
            }
            return of(this._projects.filter(project => project.projectGroup === kind));
        }
        if (kind) {
            return of(this._projects.filter(project => project.name.toLowerCase().includes(kind)));
        }
        return of(this._projects);
    }

    getItemById(id: number): Observable<any> {
        return of(this._projects.find(item => item.id === id));
    }

    createItem(item: ExcludeId<IProject>): Observable<any> {
        const id = this._projects.length + 1;
        const createdItem = { ...item, id };
        createdItem.status = ProjectStatus.Draft,
        this._projects.push(createdItem as any);
        return of(createdItem);
    }

    updateItem(item): Observable<any> {
        const ind = this._projects.findIndex(el => el.id === item.id);
        this._projects[ind] = item;
        return of(this._projects[ind]);
    }

    deleteItem(id: number): Observable<any> {
        const temp = this._projects.find(el => el.id === id);
        this._projects.splice(this._projects.indexOf(temp), 1);
        return of(this._projects);
    }

}

// protected _getItems(): IProject[] {
    // //         return new Array(10).fill('').map((i, id) =>
    // //             ({
    // //                 id,
    // //                 name: `Project ${id}`,
    // //                 description: `Description of project${id}`,
    // //                 createdAt: id,
    // //                 lastModified: id + 1,
    // //                 creatorId: id,
    // //                 status: ProjectsStatus.Actives,
    // //                 modifiedInGantt: false,
    // //                 parentId: id + 3
    // //             }));
    // //     }
