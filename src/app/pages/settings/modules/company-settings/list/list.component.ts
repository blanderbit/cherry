import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    forwardRef,
    Inject,
    OnDestroy,
    OnInit,
    Optional,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {CountriesProvider, Provider} from 'communication';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CompanySettingsForm} from '../forms/company-settings-form.component';
import {GridContainerComponent, GridItemsComponent} from 'grid';
import {CompanySettingsPermissions, FormContainer, HEADER, PARAM_KEYS} from '../keys';
import {NotifierService} from 'notifier';
import {IPaginationParams} from '../../../../../../../projects/communication/src/lib/models/pagination';
import {FormGroup} from '@angular/forms';
import {ListHandler} from 'src/app/pages/settings/modules/company-settings/list/list.handler';
import {ICompanySettingsPermissions} from '../models/permissions';
import {GRID_COLUMN_DEFS} from '../../../../../ui/ag-grid/grid-container/token';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [
        {
            provide: FormContainer,
            useExisting: forwardRef(() => ListComponent)
        }
    ]
})
export class ListComponent extends GridItemsComponent<any> implements OnInit, OnDestroy {
    public items = null;
    public createFormShown = false;
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public loadDataOnQueryParamsChange = true;
    public countries = this.countriesProvider.getItems();
    public fakeForm = new FormGroup({});

    @ViewChild('container', {read: ViewContainerRef, static: true})
    private container: ViewContainerRef;

    @ViewChild('headerContainer', {read: ViewContainerRef, static: true})
    private headerContainer: ViewContainerRef;

    @ViewChild(GridContainerComponent, {static: true})
    grid: GridContainerComponent;

    private form: ComponentRef<CompanySettingsForm<any>>;
    redirectToDetails = [];

    get provider() {
        return this._provider;
    }

    get formInstance() {
        return this.form && this.form.instance;
    }
    get isHolidayPage() {
       return !!this._route.snapshot.params.holidayPolicyId;
    }

    constructor(protected _provider: Provider,
                protected _route: ActivatedRoute,
                protected _router: Router,
                private resolver: ComponentFactoryResolver,
                private countriesProvider: CountriesProvider,
                protected _notifier: NotifierService,
                @Inject(GRID_COLUMN_DEFS) public colsDef: any[],
                @Inject(CompanySettingsPermissions) public permissions: ICompanySettingsPermissions,
                @Optional() @Inject(ListHandler) public listHandler: ListHandler,
                @Optional() @Inject(HEADER) public header,
                @Optional() @Inject(CompanySettingsForm) protected _formToken: Type<CompanySettingsForm<any>>) {
        super();
        this.redirectToDetails = this.colsDef
            .filter(({redirectToDetails}) => redirectToDetails)
            .map(({field}) => field);
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this._formToken) {
            this.form = this.createComponent(this.container, this._formToken);
        }

        if (this.header) {
            this.createComponent(this.headerContainer, this.header);
        }
    }

    needHandleCreateItem(item: any): boolean {
        if (this.listHandler)
            return this.listHandler.handleCreateItem(item, this);

        return super.needHandleCreateItem(item);
    }

    loadData(params?) {
        const p = this.route.snapshot.params;
        super.loadData({...p, ...params});
    }

    protected _onQueryParamsChanged({...params} = <IPaginationParams<string>>{}) {
        const editId = params[PARAM_KEYS.EDIT_QUERY];

        if (editId != null) {
            this.showCreateForm();
            this.formInstance.loadData(+editId || editId);
        }

        const ignoreFields = [PARAM_KEYS.EDIT_QUERY, PARAM_KEYS.POLICY_ID, 'totalItems'];

        for (const f of ignoreFields) {
            delete params[f];
        }

        super._onQueryParamsChanged(params);
    }

    public apply(e) {
        const component = this.form && this.form.instance;

        if (component)
            component.apply(e);
    }

    public showCreateForm() {
        this.createFormShown = true;
        this.clearEditQueryParams();
        const component = this.form && this.form.instance;

        if (component)
            component.reset();
    }
    isEdit() {

        console.log( 'edit', this._route.snapshot.queryParams[PARAM_KEYS.EDIT_QUERY]);
        return this._route.snapshot.queryParams[PARAM_KEYS.EDIT_QUERY];
    }

    public hideCreateForm() {
        this.createFormShown = false;
        this.clearEditQueryParams();
        this.formInstance.setItem(null);
        this.formInstance.reset();
    }

    public clearEditQueryParams() {
        this.setEditQueryParams(null);
    }

    resetForm() {
        this.formInstance.form.reset();
    }

    private createComponent(container: ViewContainerRef, componentToken: Type<any>): ComponentRef<any> {
        const factory = this.resolver.resolveComponentFactory(componentToken);
        return container.createComponent(factory);
    }

    private setEditQueryParams(value, navigationExtras?: NavigationExtras) {
        this._router.navigate([], {
            relativeTo: this._route,
            queryParamsHandling: 'merge',
            queryParams: {
                [PARAM_KEYS.EDIT_QUERY]: value,
            },
            ...navigationExtras,
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.form)
            this.form.destroy();
    }
}
