import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { PermissionActionType } from 'communication';
import { PermissionsService } from 'permissions';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startWith } from 'rxjs/operators';

export type QueryParamsHandling = 'merge' | 'preserve' | '';

export interface INavigationItem {
    icon?: string;
    iconUrl?: string;
    title: string;
    url?: string;
    queryParams?: any;
    exact?: boolean;
    onClick?: (event: MouseEvent) => any;
    permissionAction?: PermissionActionType;

    skipLocationChange?: boolean;
    queryParamsHandling?: QueryParamsHandling;
    routerLinkActive?: string;
    navigation?: INavigationItem[];
}

export interface ISidebarNavigationData {
    titleUrl?: string;
    queryParams?: any;
    routerLinkActive?: string;

    navigation?: INavigationItem[];
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy, ISidebarNavigationData {
    @ViewChild(RouterLinkActive, { static: true }) activatedRoute: RouterLinkActive;
    readonly DEFAULT_ACTIVE_LINK_CLASS = 'active-link';

    @Input() set navigationData(value: ISidebarNavigationData) {
        this.setData(value);
    }

    @Input()
    public routerLinkActive: string;

    @Input()
    public navigation: INavigationItem[];

    @Input()
    public titleUrl: string;

    @Input()
    public queryParams: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        const routeData = <ISidebarNavigationData>this.route.snapshot.data;

        if (routeData.navigation) {
            this.setData(routeData);
        }

        this.router.events.pipe(
                startWith(''),
                untilDestroyed(this)
            )
            .subscribe(() => {
                setTimeout(() => this.cdr.markForCheck());
        });
    }

    public toNavigationItem(item: any) {
        return item as INavigationItem;
    }

    private setData(data: ISidebarNavigationData) {
        const { navigation, routerLinkActive, titleUrl, queryParams } = data;

        this.navigation = navigation;
        this.routerLinkActive = routerLinkActive;
        this.titleUrl = titleUrl;
        this.queryParams = queryParams;
    }

    ngOnDestroy(): void {
    }
}
