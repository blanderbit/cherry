import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardRoutes} from '../dashboard/dashboard.routes';

export interface IErrorsCode {
    code: number;
    description: string;
}

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
    private errors = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'We can’t seem to find the page you’re looking for.',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        503: 'Service Unavailable',
        511: 'Network Authentication Required',
    };

    homeLink = DashboardRoutes.HOME;

    error: IErrorsCode = {
        code: null,
        description: 'Something went wrong',
    };

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        const { error } = this.route.snapshot.params;
        if (this.errors[error]) {
            this.error = {
                code: error,
                description: this.errors[error],
            };
        }
    }
}
