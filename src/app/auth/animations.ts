import { animate, style, transition, trigger } from '@angular/animations';

export const slideInFromRightAnimation = trigger('slideInFromRight', [
    transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('180ms ease', style({transform: 'translateX(0%)'})),
    ]),
]);

export const slideInFromLeftAnimation = trigger('slideInFromLeft', [
    transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('180ms ease', style({transform: 'translateX(0%)'})),
    ]),
]);

export const skipInitialAnimation = trigger('skipInitialAnimation', [
    transition(':enter', [])
]);

