import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { SelectModule } from '../../select/select.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserModule } from '../../../user/user.module';
import { CustomDirectivesModule } from '../../../custom-directives/custom-directives.module';
import { LoaderModule } from 'loader';
import { FormControlModule } from 'form-control';
import { BrowserFileModule, FileLoader } from 'platform-file-loader';
import { BrowserFileLoader } from '../../../../../projects/platform-file-loader/src/lib/browser/browser-file.loader';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Meta } from 'meta';
import { BrowserCookieModule } from 'cookie-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MODULE_PREFIX } from '../../../../../projects/translate/src/lib/module-translate.loader';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PaginatorComponent', () => {
    let fixture: ComponentFixture<PaginatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaginatorComponent],
            imports: [NgbModule,
                // Translate.forRoot('dashboard'),
                TranslateModule,
                UserModule,
                CustomDirectivesModule,
                SelectModule,
                LoaderModule,
                FormControlModule,
                BrowserTransferStateModule,
                BrowserFileModule.forRoot({root: './'}),
                Meta.forRoot(),
                BrowserCookieModule.forRoot(),
                RouterTestingModule.withRoutes([
                    {
                        path: '',
                        component: PaginatorComponent,
                    }
                ]),
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: FileLoader,
                    useClass: BrowserFileLoader,
                },
                {
                    provide: REQUEST,
                    useValue: {cookie: '', headers: {}},
                },
                // Translate,
                {
                    provide: MODULE_PREFIX,
                    useValue: module,
                },
                Location,
            ]
        }).compileComponents();
    }));

    it('should create', () => {
        const {component} = setup();
        expect(component).toBeTruthy();
    });

    it('should contain query params', fakeAsync(() => {
        const {component, location} = setup();

        setPaginationParams(component);

        tick();

        const url = location.path();
        expect(url).toContain('take=10');
        expect(url).toContain('skip=20');
    }));

    it('should be called 2 times', (() => {
        const {component, router} = setup();
        const navigateSpy = spyOn(router, 'navigate');

        setPaginationParams(component);

        expect(navigateSpy).toHaveBeenCalledTimes(2);
    }));

    it('should be called 3 times', (() => {
        const {component, router} = setup();
        const navigateSpy = spyOn(router, 'navigate');

        router.navigate([], {queryParams: {skip: 1, take: 2}});

        setPaginationParams(component);
        component.totalItems = 100;

        expect(navigateSpy).toHaveBeenCalledTimes(3);
    }));

    it('page should be equal to 3', (() => {
        const {component} = setup();

        setPaginationParams(component);
        expect(component.page).toEqual(3);
    }));

    it('should be 6 pages', (() => {
        const {component} = setup();

        setPaginationParams(component);
        expect(component.totalPages).toEqual(6);
    }));

    it('should be 5 full pages', (() => {
        const {component} = setup();

        setPaginationParams(component);
        expect(component.totalFullPages).toEqual(5);
    }));

    it('shouldn\'t be first page', (() => {
        const {component} = setup();

        setPaginationParams(component);
        expect(component.isFirstPage).toEqual(false);
    }));

    function setPaginationParams(component: PaginatorComponent) {
        component.skip = 20;
        component.take = 10;
        component.totalItems = 55;
    }

    function setup() {
        fixture = TestBed.createComponent(PaginatorComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        const router = <Router>TestBed.get(Router);
        const route = <ActivatedRoute>TestBed.get(ActivatedRoute);
        const location = <Location>TestBed.get(Location);

        return {component, location, router, route};
    }
});
