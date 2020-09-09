import { ResourcesSubModule } from './resources.sub-module';
import { Translate } from 'translate';
import {
    LocationsProvider,
    MaterialResourcesProvider,
    MaterialResourceStatus,
    PermissionsMaterialResourcesAction,
    PermissionsProvider,
    PermissionsSystemLevelAction,
    Provider, ResourceKind,
} from 'communication';
import { FieldsProvider } from './fields.provider';
import { Components } from 'dynamic-form-control';
import {
    locationColDef,
    nameColDef,
    resourceIdColDef,
    responsibleColDef,
    statusColDef,
} from './columns-def';
import { ResourcesPermissions } from './resources.module';
import { IResourcesPermissions } from './resources/resources.component';
import { GRID_COLUMN_DEFS } from '../../ui/ag-grid/grid-container/token';
import { RESOURCES_ROUTES } from './resources-routes';

@ResourcesSubModule({
    permissionCreate: PermissionsSystemLevelAction.CreateMaterialResource,
    permissionUpdate: PermissionsSystemLevelAction.UpdateMaterialResource,
    resourceFormConfig: {
        resourceKind: ResourceKind.Material
    },
    imports: [
        Translate.localize('material-resources'),
    ],
    providers: [
        {
            provide: Provider,
            useExisting: MaterialResourcesProvider,
        },
        {
            provide: FieldsProvider,
            useValue: Components.translate('form', [
                FieldsProvider.getNameControl(),
                FieldsProvider.getCodeControl(),
                {
                    component: Components.Autocomplete,
                    name: 'locationId',
                    label: 'location',
                    provider: LocationsProvider,
                },
                FieldsProvider.getResponsibleControl(),
                Components.divider(),
                FieldsProvider.getAvailabilityControl(),
                FieldsProvider.getStatusControl(MaterialResourceStatus, MaterialResourceStatus.Active),
            ])
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: [
                nameColDef,
                locationColDef,
                resourceIdColDef,
                statusColDef,
                responsibleColDef,
            ]
        },
        {
            provide: ResourcesPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<IResourcesPermissions>(PermissionsMaterialResourcesAction, RESOURCES_ROUTES.material)
        },
    ]
})
export class MaterialResourcesModule {
}
