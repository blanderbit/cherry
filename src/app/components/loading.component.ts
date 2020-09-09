import { OnDestroy, OnInit } from '@angular/core';
import { IIdObject, IPermission, IProject, IRealtimeMessage, PermissionAction, Provider } from 'communication';
import { NotifierService } from 'notifier';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'underscore';
import { IPaginationParams } from '../../../projects/communication/src/lib/models/pagination';
import { getId, IProjectPermissionsManagerParams, ProjectsPermissionsManager } from 'permissions';
import { EMPTY, Observable, of } from 'rxjs';

type HideLoader = () => void;

export interface ILoadingHandler {
    showLoading: (init?: boolean) => () => void;
    loading: boolean;
    initializing: boolean;
}

const DEFAULT_PERMISSIONS_DATA: IProjectPermissionsManagerParams = {
    loadPermissions: true,
    setProjectContext: true,
    projectId: null,
};

export abstract class LoadingComponent<T, I extends IIdObject = any> implements OnInit, OnDestroy, ILoadingHandler {
    private _loadingProcesses = 0;
    protected _loading;
    protected _initializing = false;

    public minLoadingTime = 300;

    // todo move this in object options
    loadDataOnInit = true;
    loadDataOnParamsChange = true;
    loadDataOnQueryParamsChange = false;
    timeBeforeLoadingStart = 0;
    loadingHandler: ILoadingHandler = this;
    permissionAction = PermissionAction;

    protected _route: ActivatedRoute;
    protected _router: Router;
    protected _permissionsManager: ProjectsPermissionsManager;
    protected _queryParams;

    get loading() {
        if (this.loadingHandler && this.loadingHandler !== this) {
            return this.loadingHandler.loading;
        }

        return this._loading;
    }

    get initializing() {
        if (this.loadingHandler && this.loadingHandler !== this) {
            return this.loadingHandler.initializing;
        }

        return this._initializing;
    }


    get route(): ActivatedRoute {
        if (!this._route)
            throw new Error('Please provide valid activated route');

        return this._route;
    }

    set router(router: Router) {
        this._router = router;
    }

    set route(value: ActivatedRoute) {
        this._route = value;
    }

    get router(): Router {
        if (!this._router) {
            throw new Error('Please provide valid router');
        }

        return this._router;
    }

    protected _provider?: Provider<I>;

    get provider(): Provider<I> {
        if (!this._provider)
            throw new Error('Please provide valid provider');

        return this._provider;
    }

    set provider(value: Provider<I>) {
        this._provider = value;
    }

    protected _notifier?: NotifierService;

    protected get notifier(): NotifierService {
        if (!this._notifier)
            throw new Error('Please provide valid notifier');

        return this._notifier;
    }

    protected set notifier(value: NotifierService) {
        this._notifier = value;
    }

    protected set permissionsManager(value: ProjectsPermissionsManager) {
        this._permissionsManager = value;
    }

    protected get permissionsManager() {
        if (this._permissionsManager) {
            return this._permissionsManager;
        }

        throw new Error('Please provide valid permissions manager');
    }

    ngOnInit(): void {
        if (this.loadDataOnInit)
            this.loadData();

        if (this.loadDataOnParamsChange)
            this.route.params
                .pipe(untilDestroyed(this))
                .subscribe((params) => {
                    this._onParamsChanged(params);
                });

        if (this.loadDataOnQueryParamsChange)
            this.route.queryParams
                .pipe(
                    untilDestroyed(this),
                    debounceTime(50),
                ).subscribe((params) => {
                this._onQueryParamsChanged(params);
            });

        this.subscribeToRealtime();
    }

    subscribeToRealtime() {
        if (this._provider) {
            if (this.provider.delete$)
                this.provider.delete$.pipe(untilDestroyed(this))
                    .subscribe(res => this._handleRealtimeDeleteItem(res));

            if (this.provider.update$)
                this.provider.update$.pipe(untilDestroyed(this))
                    .subscribe(res => this._handleRealtimeUpdateItem(res));

            if (this.provider.create$)
                this.provider.create$.pipe(untilDestroyed(this))
                    .subscribe(res => this._handleRealtimeCreateItem(res));
        }
    }

    /**
     * @params.event - set when you want to prevent default
     * */
    deleteItem(item: I, event?) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const hide = this.showLoading();
        this._deleteItem(item)
            .pipe(finalize(hide))
            .subscribe(
                () => {
                    this._handleDeleteItem(item);
                    this._showSuccessDelete();
                },
                err => {
                    this._handleDeleteError(err);
                },
            );
    }

    protected _deleteItem({id}: I) {
        return this.provider.deleteItem(id);
    }

    loadData(params?: any) {
    }

    showLoading(initializing = false): HideLoader {
        if (this.loadingHandler && this.loadingHandler !== this) {
            return this.loadingHandler.showLoading(initializing);
        }

        this._loadingProcesses++;
        this._loading = true;
        this._initializing = initializing;

        this.timeBeforeLoadingStart = this.timeBeforeLoadingStart || Date.now();

        return () => {
            if (this._loadingProcesses <= 0)
                return;

            if (--this._loadingProcesses === 0) {
                const time = Date.now();
                const diff = time - this.timeBeforeLoadingStart;
                this.timeBeforeLoadingStart = 0;

                setTimeout(() => {
                    if (this._loadingProcesses === 0) {
                        this._loading = false;
                        this._initializing = false;
                    }
                }, diff < this.minLoadingTime ? this.minLoadingTime - diff : 0);
            }
        };
    }

    protected _showSuccessDelete() {
        this.showSuccess('action.successfully-deleted');
    }

    protected _handleDeleteError(error: Error) {
        this.showError(error, 'action.delete-error');
    }

    protected _handleLoadingError(error: Error) {
        return undefined;
    }

    protected _handleRealtimeUpdateItem(message: IRealtimeMessage<I>) {
        if (message && message.payload)
            this._handleUpdateItem(message.payload);
    }

    protected _handleUpdateItem(item: I) {
        console.warn('Implement _handleUpdateItem');
    }

    protected _handleRealtimeCreateItem(message: IRealtimeMessage<I>) {
        if (message && message.payload && this.needHandleCreateItem(message.payload))
            this._handleCreateItem(message.payload);
    }

    needHandleCreateItem(item: I) {
        return true;
    }

    protected _handleCreateItem(item: I | I[]) {
        console.warn('Implement _handleCreateItem');
    }

    protected _handleRealtimeDeleteItem(message: IRealtimeMessage<IIdObject>) {
        if (message && message.payload)
            this._handleDeleteItem(message.payload);
    }

    protected _handleDeleteItem(item: IIdObject) {
        this._navigateOnSuccessAction();
    }

    protected _navigateOnSuccessAction(item?: T) {
        window.history.back();
    }

    protected _onQueryParamsChanged(params?: any) {
        if (this.isQueryParamsChanged(this._queryParams, params)) {
            this._queryParams = params;
            this.loadData(params);
        }
    }

    protected _onParamsChanged(params?: any) {
        this.loadData(params);
    }

    protected isQueryParamsChanged(oldParams: IPaginationParams<string>, params: IPaginationParams<string>): boolean {
        return !isEqual(oldParams, params);
    }

    showSuccess(messageOrKey: string) {
        this.notifier.showSuccess(this._getTranslateKey(messageOrKey));
    }

    showError(messageOrKey: any, defaultMessage?) {
        this.notifier.showError(this._getTranslateKey(messageOrKey), this._getTranslateKey(defaultMessage));
    }

    protected _getTranslateKey(key) {
        return key;
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return null;
    }

    protected getPermissions(): Observable<IPermission[]> {
        const data = {...DEFAULT_PERMISSIONS_DATA, ...this.getPermissionsData()};
        const dataValid = data && data.projectId;

        if (this._permissionsManager && dataValid) {
            const {loadPermissions, setProjectContext, projectId} = data;
            const permissionsRequest = loadPermissions ? this.permissionsManager.getProjectPermissions(projectId) : of(null);

            return permissionsRequest.pipe(
                tap(() => {
                    if (setProjectContext) {
                        this.setProjectContext(getId(projectId));
                    }
                }));
        }

        return of(null);
    }

    protected setProjectContext(id?: number): Observable<number | null> {
        const data = this.getPermissionsData();
        const projectId = id || (data && data.projectId);

        if (this._permissionsManager && projectId) {
            return this._permissionsManager.setProjectContext(projectId);
        }

        return of(null);
    }

    ngOnDestroy(): void {
        // console.log('ngOnDestroy', this.constructor.name);
    }
}
