import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { Translate } from 'translate';
import { ListComponent } from './list/list.component';
import { GridModule } from '../../../../ui/ag-grid/ag-grid.module';
import { ActionsComponent } from './actions/actions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'loader';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from 'form-control';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FileToken } from 'src/app/pages/settings/modules/descriptions/file.token';
import { PermissionsModule } from 'permissions';

export interface IResourcesSubModuleConfig {
    providers?: Provider[];
    imports?: (ModuleWithProviders | any)[];
    routes?: Route[];
    childRouter?: RouterModule;
    localize?: string;
}

@NgModule({
    imports: [
        CommonModule,
        Translate,
        GridModule.withComponents([ActionsComponent]),
        ReactiveFormsModule,
        LoaderModule,
        NgbModalModule,
        RouterModule,
        FormControlModule,
        TextFieldModule,
        PermissionsModule,
    ],
    declarations: [
        ActionsComponent,
        ListComponent,
    ],
})
export class BaseSettingsModule {
}

export function CompanySettings(config: IResourcesSubModuleConfig) {
    return NgModule({
        imports: [
            Translate.localize(config.localize),
            BaseSettingsModule,
            RouterModule.forChild([
                {
                    path: 'description',
                    // throws error on server build
                    // loadChildren: () => import('../descriptions/descriptions.module').then(m => m.DescriptionsModule),
                    loadChildren: '../descriptions/descriptions.module#DescriptionsModule'
                },
                {
                    path: '',
                    component: ListComponent
                },
            ]),
            ...(config.imports || []),
        ],
        providers: [
            {
                provide: FileToken,
                useValue: config.localize
            },
            ...(config.providers || []),
        ],
    });
}

