import { Component, forwardRef, HostListener, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ModulesContainer } from './modules.container';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter, tap } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { PermissionAction, RealtimeProvider } from 'communication';
import { NotifierService } from 'notifier';
import { ReplaySubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { GridService } from '../../ui/ag-grid/grid.service';
import { RouterRedirectComponent } from '../../components/router-redirect.component';

@Component({
    selector: 'app-home',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [
        {
            provide: ModulesContainer,
            useExisting: forwardRef(() => DashboardComponent),
        },
    ],
})
export class DashboardComponent extends RouterRedirectComponent implements OnInit, OnDestroy {
    realtimeFrame = false;
    leftMenuVisible = true;
    users: any;
    permissionAction = PermissionAction;
    moduleChange = new ReplaySubject<string>(1);
    protected _baseRoute = '';

    constructor(private _realtimeService: RealtimeProvider,
                private _notifier: NotifierService,
                private _gridService: GridService,
                protected _injector: Injector,
                @Inject(PLATFORM_ID) private _platformId) {
        super(_injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this._activatedRoute.queryParams
            .subscribe((params) => this.showRealtimeFrame(params));

        if (isPlatformBrowser(this._platformId))
            this._realtimeService.init().subscribe(
                () => null,
                error => this._notifier.showError(error, 'Can\'t init realtime connection'),
            );

        this._router.events
            .pipe(
                untilDestroyed(this),
                filter(e => e instanceof NavigationEnd),
                tap(e => this._handleNavigationChange(e as NavigationEnd)),
            ).subscribe();
        this._handleModuleLoading(this._router.url);
    }

    showRealtimeFrame(params) {
        this.realtimeFrame = params.ws != null;
    }

    private _handleNavigationChange(event: NavigationEnd) {
        this._handleModuleLoading(event.url);
    }

    private _handleModuleLoading(url: string) {
        const module = getModule(url);
        this.moduleChange.next(module);

        document.getElementsByTagName('body')[0].className = module;
    }

    toggleLeftMenu() {
        this.leftMenuVisible = !this.leftMenuVisible;
        this._gridService.resizeGrid(200);
    }

    @HostListener('window:beforeunload')
    clearRealtime() {
        this._realtimeService.destroy().subscribe(
            () => null,
            error => this._notifier.showError(error, 'Can\'t destroy realtime connection'),
        );
    }

    ngOnDestroy(): void {
        this.clearRealtime();
    }
}

function getModule(url: string) {
    const module = url.split(/[?\/]/).filter(Boolean)[0];

    return module && module.toLowerCase();
}
