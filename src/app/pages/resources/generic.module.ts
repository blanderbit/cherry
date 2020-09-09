import { ResourcesSubModule } from './resources.sub-module';
import {
    GenericResourcesProvider,
    GenericResourceStatus,
    PermissionsGenericResourcesAction,
    PermissionsProvider,
    PermissionsSystemLevelAction,
    Provider, ResourceKind,
} from 'communication';
import { FieldsProvider } from './fields.provider';
import { Components } from 'dynamic-form-control';
import { RateControlModule } from './rate-control/rate-control.module';
import { Translate } from 'translate';
import { resourceIdColDef, statusColDef } from './columns-def';
import { FormHandler, GenericFormHandler } from './form.handler';
import { ResourcesPermissions } from './resources.module';
import { IResourcesPermissions } from './resources/resources.component';
import { GRID_COLUMN_DEFS } from '../../ui/ag-grid/grid-container/token';
import { RESOURCES_ROUTES } from './resources-routes';

@ResourcesSubModule({
    permissionCreate: PermissionsSystemLevelAction.CreateGenericResource,
    permissionUpdate: PermissionsSystemLevelAction.UpdateGenericResource,
    resourceFormConfig: {
        resourceKind: ResourceKind.Generic
    },
    imports: [
        Translate.localize('generic-resources'),
        RateControlModule,
    ],
    providers: [
        {
            provide: Provider,
            useExisting: GenericResourcesProvider
        },
        {
            provide: FormHandler,
            useClass: GenericFormHandler,
        },
        {
            provide: FieldsProvider,
            useValue: Components.translate('form', [
                FieldsProvider.getNameControl(),
                FieldsProvider.getCodeControl(),
                // #TODO Uncomment after implementation
                //
                // [
                //     {
                //         component: 'rate-control',
                //         name: 'internalRate',
                //     },
                //     {
                //         component: 'rate-control',
                //         name: 'billableRate',
                //     }
                // ],
                FieldsProvider.getStatusControl(GenericResourceStatus, GenericResourceStatus.Active),
            ])
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: [
                {
                    field: 'name',
                },
                resourceIdColDef,
                statusColDef,
            ],
        },
        {
            provide: ResourcesPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<IResourcesPermissions>(PermissionsGenericResourcesAction, RESOURCES_ROUTES.generic)
        },
        // {
        //     provide: GridFilterHiddenColumnsToken,
        //     useValue: [
        //         'name',
        //     ] as (keyof IGenericResource)[]
        // }
    ]
})
export class GenericResourcesModule {
}
