import { Component, Inject, Injector, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogConfig } from '../dialogs';
import { NavigationEnd, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

export interface IBaseDialogParams {
    translatePrefix?: string;
    showCloseBtn?: boolean;
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent<ConfigType = any> implements OnInit, OnDestroy {
    @Input()
    showCloseBtn = true;

    @Input()
    translatePrefix = '';

    @Input()
    title: string;

    @Input()
    loading: boolean;

    get config(): ConfigType {
        return this._config;
    }

    set config(config) {
        if (config) {
            Object.assign(this, config);
        }
    }

    constructor(@Inject(NgbActiveModal) protected activeModal,
                @Inject(Router) protected _router: Router,
                @Optional() @Inject(DialogConfig) private _config: ConfigType,
                @Inject(Injector) protected injector) {
        this.config = _config;
    }

    ngOnInit(): void {
        this.closeOnNavigation();
    }

    closeOnNavigation() {
        this._router.events
            .pipe(
                untilDestroyed(this),
            ).subscribe((val) => {
            if (val instanceof NavigationEnd)
                this.close();
        });
    }

    submit() {
        this.activeModal.close(true);
    }

    close() {
        this.activeModal.dismiss(false);

    }

    ngOnDestroy(): void {
        // for takeUntil operator
    }
}
