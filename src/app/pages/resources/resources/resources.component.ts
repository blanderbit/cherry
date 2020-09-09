import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { AnyResource, IHumanResource, IMaterialResource, LocationsProvider, PermissionActionType, Provider } from 'communication';
import { NotifierService } from 'notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { GridContainerComponent, GridItemsComponent } from 'grid';
import { ResourcesPermissions } from '../resources.module';
import { PermissionsService } from 'permissions';
import { Observable, of } from 'rxjs';
import { GRID_COLUMN_DEFS } from '../../../ui/ag-grid/grid-container/token';

export interface IResourcesPermissions {
    updateResource: PermissionActionType;
    createResource: PermissionActionType;
    searchResource: PermissionActionType;
    deleteResource?: PermissionActionType;
}

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent extends GridItemsComponent<AnyResource> {
    @ViewChild(GridContainerComponent, {static: true})
    gridContainer: GridContainerComponent;

    loadDataOnQueryParamsChange = true;
    loadDataOnParamsChange = false;
    loadDataOnInit = false;
    searchControl = new FormControl();
    redirectToDetails = false;
    items = null;

    constructor(protected _provider: Provider,
                protected _notifier: NotifierService,
                @Optional() @Inject(GRID_COLUMN_DEFS) public columnsDef,
                @Optional() @Inject(ResourcesPermissions) public permissions: IResourcesPermissions,
                protected _locationsProvider: LocationsProvider,
                protected _route: ActivatedRoute,
                protected _router: Router,
                private _permissionsService: PermissionsService) {
        super();

        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
            ).subscribe(search => {
            this.router.navigate(['./'], {
                relativeTo: this.route,
                queryParams: {search},
                queryParamsHandling: 'merge',
            });
        });

        this.redirectToDetails = this._permissionsService.hasPermissions(permissions.updateResource);
    }

    protected _getItems(params?): Observable<AnyResource[]> {
        return super._getItems(params)
            .pipe(
                flatMap((resources) => {
                    const locationsIds = resources.map(resource => (resource as IMaterialResource | IHumanResource).locationId);
                    return this._locationsProvider.getItemsByIds(locationsIds.filter(Boolean))
                        .pipe(
                            catchError(() => of([])),
                            map(locations => {
                                return resources.map(resource => {
                                    const location = locations.find(l =>
                                        l.id === (resource as IMaterialResource | IHumanResource).locationId);

                                    return {
                                        ...resource,
                                        locationId: location && location.name as unknown as number
                                    };
                                });
                            })
                        );
                }));
    }

    protected _handleResponse(response: AnyResource[]) {
        console.log('RESPONSE', response);
        super._handleResponse(response);
    }

    protected _onQueryParamsChanged(params?) {
        super._onQueryParamsChanged(params);
        if (!params.search)
            this.searchControl.setValue('', {emitEvent: false});

        // TODO: Review
        // fix translates
        setTimeout(() => {
            try {
                if (this.gridContainer) {
                    this.gridContainer.gridApi.refreshHeader();
                }
            } catch (e) {
                console.warn('GRID ERROR', e);
                console.error(e);
            }
        });
    }

    protected _handleCreateItem(item) {
        super._handleCreateItem(item);
    }
}
