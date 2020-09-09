import { HumanResourcesProvider, IProject, IProjectMember, ProjectStatus, IResource, ProjectsProvider } from 'communication';
import { IItem } from 'menu';
import { GridItemsComponent } from 'grid';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../identify/profile.service';
import { NotifierService } from 'notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { GridService } from '../ui/ag-grid/grid.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface IProjectWithOwnerAndMembers extends IProject {
    creator: Partial<IResource>;
    members: IProjectMember[];
}

enum DisplayType {
    Table,
    Card,
}

const TYPE_KEY = 'view';

class MenuItemsSwitch {
    constructor(public shownItem: IItem, public hiddenItem: IItem) {
    }

    toggle() {
        const {shownItem, hiddenItem} = this;
        const temp = hiddenItem;

        this.hiddenItem = shownItem;
        return this.shownItem = temp;
    }
}

@Injectable()
export abstract class BaseProjectsComponent extends GridItemsComponent<IProject, any> implements OnInit, OnDestroy {
    items: IProject[] = null;
    ProjectStatus = ProjectStatus;
    loadDataOnInit = false;
    loadDataOnQueryParamsChange = true;
    loadDataOnParamsChange = false;
    completedProjectsHidden = false;
    menuItemSwitch = new MenuItemsSwitch({
            title: 'details.hide-completed-projects',
            icon: 'hide',
            action: () => this.toggleFilterCompletedProjects(),
        },
        {
            title: 'details.show-all-projects',
            icon: 'show-completed-tasks',
            action: () => this.toggleFilterCompletedProjects(),
        });

    get isCardView(): boolean {
        return <any>this.route.snapshot.queryParamMap.get(TYPE_KEY) == DisplayType.Card;
    }

    menuItems = [
        this.menuItemSwitch.shownItem,
        // TODO: Uncomment after export implementation
        // {
        //     title: 'details.exportCSV',
        //     icon: 'download',
        //     action: () => this.gridService.exportToCSV(true),
        // },
    ];

    constructor(protected _provider: ProjectsProvider,
                private _profile: ProfileService,
                private _userProvider: HumanResourcesProvider,
                protected _notifier: NotifierService,
                public route: ActivatedRoute,
                protected _router: Router,
                public gridService: GridService) {
        super();
    }

    doesExternalFilterPass(node) {
        if (this.completedProjectsHidden) {
            return node.data.status !== ProjectStatus.Completed;
        }

        return true;
    }

    toggleFilterCompletedProjects() {
        const api = this.grid.gridApi;
        this.completedProjectsHidden = !this.completedProjectsHidden;

        setTimeout(() => {
            this.menuItems[0] = this.menuItemSwitch.toggle();
        });
        if (api) {

            api.onFilterChanged();
        }
    }

    protected isQueryParamsChanged(oldParams, params): boolean {
        const {view: view1, ...prev} = <any>(oldParams || {});
        const {view: view2, ...curr} = <any>(params || {});

        return super.isQueryParamsChanged(prev, curr);
    }

    protected _handleCreateItem(item: IProjectWithOwnerAndMembers) {
        if (item.creatorId === this._profile.resourceId) {
            item.creator = this._profile.profile;

            super._handleCreateItem(item);
        }
    }

    public toggleCardView() {
        const queryParams = {[TYPE_KEY]: this.isCardView ? DisplayType.Table : DisplayType.Card};

        this.router.navigate([], {queryParams, queryParamsHandling: 'merge'});
    }

    protected _getItems(params?: any): Observable<any> {
        return this._provider.getItems(params).pipe(
            switchMap(projects => {
                const ids = projects.map(project => project.creatorId).getUnique();
                return this._userProvider.getBaseItemsByIds(ids).pipe(
                    map((creators) => projects.map((val: IProjectWithOwnerAndMembers) => {
                        val.creator = creators.find((creator) => creator.id === val.creatorId);
                        return val;
                    })),
                );
            }),
        );
    }
}
