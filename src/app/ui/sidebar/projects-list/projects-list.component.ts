import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ItemsComponent } from 'components';
import { NotifierService } from 'notifier';
import { IProject, IProjectsRequestParams, ProjectsProvider, ProjectStatus, ProjectType } from 'communication';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ACTIVE_FILTER, EMPTY_FILTER, IProjectsFilterItem, PROJECTS_FILTER_PROVIDER, ProjectsFilterItems } from './filter-items';


const GET_DEFAULT_QUERY_PARAMS = (item: IProject) => ({});
const GET_DEFAULT_ROUTE = (item: IProject) => './';

@Component({
    selector: 'app-projects-list',
    templateUrl: './projects-list.component.html',
    styleUrls: ['./projects-list.component.scss'],
    providers: [
        PROJECTS_FILTER_PROVIDER,
    ],
})
export class ProjectsListComponent extends ItemsComponent<IProject, any> implements OnInit {
    @Output() projectsLoaded = new EventEmitter<IProject[]>();
    public searchControl = new FormControl();
    public filterControl = new FormControl();
    public loadDataOnParamsChange = false;
    public search = false;
    public allProjectsLoaded = false;
    public skip = 0;
    public take = 25;
    public params: any = {};
    public projectStatus = ProjectStatus;
    public projectType = ProjectType;

    @ViewChild('scrollContainer', {static: false}) scrollContainer: ElementRef;

    @Input() filterByStatus: ProjectStatus | '' = '';
    @Input() disableFilter = false;
    @Input() statuses: ProjectStatus[] = [];
    @Input() defaultParams: IProjectsRequestParams = {};
    @Input() itemTemplate: TemplateRef<HTMLLIElement>;

    @Input() getRouterLink: (item: IProject) => string = GET_DEFAULT_ROUTE;
    @Input() getQueryParams: (item: IProject) => any = GET_DEFAULT_QUERY_PARAMS;
    @Input() queryParamsHandling: 'merge' | 'preserve' | '' = '';


    get requestParams() {
        return {
            skip: this.skip,
            take: this.take,
        };
    }

    constructor(protected _provider: ProjectsProvider,
                protected _route: ActivatedRoute,
                protected _router: Router,
                @Inject(ProjectsFilterItems) public filters: IProjectsFilterItem[],
                protected _notifier: NotifierService) {
        super();
    }

    ngOnInit(): void {
        this.filterControl.setValue(this.filterByStatus);

        const search$ = this.searchControl
            .valueChanges.pipe(
            distinctUntilChanged(),
            map(name => ({name})),
            tap(() => {
                if (this.filterByStatus === this.projectStatus.InProgress) {
                    this.filterControl.setValue(ACTIVE_FILTER);
                } else {
                    this.filterControl.setValue(EMPTY_FILTER);
                }
            }),
        );
        const filter$ = this.filterControl.valueChanges.pipe(
            distinctUntilChanged(),
            map(status => ({status})),
        );

        merge(search$, filter$).pipe(
            debounceTime(300),
            // TODO: Comment if filter by one criterion(search or filter) required
            // scan((acc, value) => ({...acc, ...value}), {}),
        ).subscribe(p => {
            this.scrollContainer.nativeElement.scrollTo({top: 0, behavior: 'smooth'});
            this._resetPagination();
            this.loadData(p);
        });

        super.ngOnInit();
    }

    protected _handleCreateItem(item: IProject) {
        const {params} = this;
        const {name, status} = item;

        if (params) {
            if (params.name && name && !name.includes(params.name))
                return;

            if (params.status && status && status != params.status)
                return;
        }

        if (this.filterByStatus === '' || item.status === this.filterByStatus) {
            super._handleCreateItem(item);
        }
    }

    onScrollToBottom() {
        this.loadData(this.params);
    }

    loadData(params?: any) {
        params = {...params, search: this.searchControl.value || ''};

        if (this.loading || this.allProjectsLoaded)
            return;

        super.loadData(params);
    }

    protected _getItems(params?: any): Observable<IProject[]> {
        // if (this.statuses && this.statuses.length) {
        //     params = { ...params, status: this.statuses };
        // }

        this.params = params;


        return super._getItems({
            ...this.params, ...this.requestParams, ...params, ...this.defaultParams,
        });
    }

    showSearch(input) {
        this.search = true;
        setTimeout(() => {
            input.focus();
        });
    }

    public hideInput() {
        this.search = false;
        this.searchControl.reset();
    }

    protected _handleResponse(response: IProject[]) {
        this.projectsLoaded.emit(response);
        if (this.skip > 0) {
            this.items.push(...response);
        } else {
            this.items = response;
        }

        this.allProjectsLoaded = response.length < this.take || response.length === response['total'];
        this.skip += response.length;
    }

    private _resetPagination() {
        this.skip = 0;
        this.allProjectsLoaded = false;
    }
}
