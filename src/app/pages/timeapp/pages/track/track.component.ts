import { Component, forwardRef, InjectionToken } from '@angular/core';
import { LoadingComponent } from 'components';
import { ViewMode } from '../../models/view-mode.enum';
import { DayModeParams, IViewModeParams, ViewModeParams, WeekModeParams } from '../../models/view-mode-params';
import { ActivatedRoute, Router } from '@angular/router';


export interface IViewModeHandler {
    mode: ViewMode;

    viewModeParams: ViewModeParams;

    isWeekMode: boolean;

    params: IViewModeParams;

    setMode(mode: ViewMode): void;

    toggleViewMode(): void;

    updateQueryParams(queryParams?: IViewModeParams): void;
}

export const ViewModeHandler = new InjectionToken<IViewModeHandler>('View mode params handler');

@Component({
    selector: 'app-track-shell',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
    providers: [
        DayModeParams,
        WeekModeParams,
        {
            provide: ViewModeHandler,
            useExisting: forwardRef(() => TrackComponent),
        }
    ]
})
export class TrackComponent extends LoadingComponent<any> implements IViewModeHandler {
    public loadDataOnParamsChange = false;
    public loadDataOnInit = false;
    public viewModeParams: ViewModeParams;
    public mode: ViewMode = ViewMode.Day;

    get params() {
        if (this.mode) {
            return this.getParamsByViewMode(this.mode).params;
        }
    }

    get isWeekMode() {
        // return this.mode === ViewMode.Week;
        return this._router.url.includes(ViewMode.Week);
    }

    constructor(
        public weekModeParams: WeekModeParams,
        public dayModeParams: DayModeParams,
        protected _router: Router,
        protected _route: ActivatedRoute,
    ) {
        super();
    }

    public setMode(mode: ViewMode) {
        this.viewModeParams = this.getParamsByViewMode(this.mode = mode);
    }

    public updateQueryParams(queryParams) {
        queryParams = queryParams || this.viewModeParams.getParamsFromDate();

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
        });
    }

    public toggleViewMode(mode?: ViewMode): void {
        if (!mode) {
            mode = this.mode === ViewMode.Day ? ViewMode.Week : ViewMode.Day;
            this.viewModeParams = this.getParamsByViewMode(mode);
        }

        this.router.navigate([mode], {
            relativeTo: this.route,
            queryParams: this.viewModeParams.getParamsFromDate()
        });
    }

    protected getParamsByViewMode(mode: ViewMode) {
        switch (mode) {
            case ViewMode.Day:
                return this.dayModeParams;
            case ViewMode.Week:
                return this.weekModeParams;
            default:
                return null;
        }
    }
}
