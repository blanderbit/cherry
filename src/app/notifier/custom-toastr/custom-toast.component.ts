import { Component, OnInit } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Translate } from 'translate';

enum ToastType {
    Info = 'toast-info',
    Error = 'toast-error',
    Success = 'toast-success',
    Warning = 'toast-warning',
}

interface IToastTypeConfig {
    icon: string;
    title: string;
}

const ToastrTypeConfig = new Map<ToastType, IToastTypeConfig>([
    [
        ToastType.Info,
        {
            title: 'info',
            icon: 'icon-info'
        }
    ],
    [
        ToastType.Error,
        {
            title: 'error',
            icon: 'icon-close-button'
        }
    ],
    [
        ToastType.Success,
        {
            title: 'success',
            icon: 'icon-check-mark'
        }
    ],
    [
        ToastType.Warning,
        {
            title: 'warning',
            icon: 'icon-exclamation'
        }
    ]
]);

@Component({
    // tslint:disable-next-line:component-selector
    selector: '[app-custom-toastr]',
    templateUrl: './custom-toast.component.html',
    styleUrls: ['./custom-toast.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('inactive', style({
                opacity: 0,
            })),
            transition('inactive => active', animate('400ms ease-out', keyframes([
                style({
                    transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
                    opacity: 0,
                }),
                style({
                    transform: 'skewX(20deg)',
                    opacity: 1,
                }),
                style({
                    transform: 'skewX(-5deg)',
                    opacity: 1,
                }),
                style({
                    transform: 'none',
                    opacity: 1,
                }),
            ]))),
            transition('active => removed', animate('400ms ease-out', keyframes([
                style({
                    opacity: 1,
                }),
                style({
                    transform: 'translate3d(100%, 0, 0) skewX(30deg)',
                    opacity: 0,
                }),
            ]))),
        ]),
    ],
    providers: [
        Translate.localizeComponent('toast'),
    ]
})
export class CustomToastComponent extends Toast implements OnInit {
    public toastTypeConfig: IToastTypeConfig;

    get toastType(): ToastType {
        return <ToastType>this.toastPackage.toastType;
    }

    constructor(
        protected toastrService: ToastrService,
        public toastPackage: ToastPackage,
    ) {
        super(toastrService, toastPackage);
    }

    action(event: Event) {
        event.stopPropagation();
        this.toastPackage.triggerAction();
        return false;
    }

    ngOnInit() {
        this.toastTypeConfig = this.toastType && ToastrTypeConfig.get(this.toastType);
        this.title = this.title || this.toastTypeConfig.title;
    }

}
