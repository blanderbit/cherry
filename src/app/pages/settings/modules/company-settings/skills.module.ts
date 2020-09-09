import { CompanySettings } from './company-settings';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlModule } from 'form-control';
import { Translate } from 'translate';
import { PermissionsProvider, PermissionsSkillsAction, Provider, SkillsProvider } from 'communication';
import { skillsColumns } from './columns';
import { SkillFormComponent } from './forms/skills-form/skill-form.component';
import { CompanySettingsForm } from './forms/company-settings-form.component';
import { FormItemModule } from './forms/form-item/form-item.module';
import { DynamicFormControlModule } from 'dynamic-form-control';
import { CompanySettingsPermissions } from './keys';
import { ICompanySettingsPermissions } from './models/permissions';
import { GRID_COLUMN_DEFS, GRID_CONTAINER_OPTIONS, IGridContainerOptions } from '../../../../ui/ag-grid/grid-container/token';

@NgModule({
    imports: [
        CommonModule,
        FormControlModule,
        Translate,
        FormItemModule,
        DynamicFormControlModule,
    ],
    declarations: [
        SkillFormComponent
    ],
    providers: [
        {
            provide: CompanySettingsForm,
            useValue: SkillFormComponent
        },
        {
            provide: Provider,
            useExisting: SkillsProvider
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: skillsColumns,
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: '',
            } as IGridContainerOptions,
        }
    ],
    entryComponents: [
        SkillFormComponent
    ]
})
export class ComponentsModule {
}

@CompanySettings({
    localize: 'skills-settings',
    imports: [
        ComponentsModule
    ],
    providers: [
        {
            provide: CompanySettingsPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<ICompanySettingsPermissions>(PermissionsSkillsAction, 'skill')
        },
    ]
})
export class SkillsModule {
}
