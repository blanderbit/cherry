import { ResourcesSubModule } from './resources.sub-module';
import { Translate } from 'translate';
import {
    HumanResourcesProvider,
    HumanResourceStatus,
    IHumanResource,
    LocationsProvider,
    PermissionsHumanResourcesAction,
    PermissionsProvider,
    PermissionsSystemLevelAction,
    Provider, ResourceKind,
    ResourcesTypeProvider,
    SkillsProvider,
} from 'communication';
import { FieldsProvider } from './fields.provider';
import { Components } from 'dynamic-form-control';
import { VacationControlModule } from './vacation-control/vacation-control.module';
import { idColDef, locationColDef, nameColDef, resourceIdColDef, responsibleColDef, statusColDef } from './columns-def';
import { RateControlModule } from './rate-control/rate-control.module';
import { FormGroup, Validators } from '@angular/forms';
import { FormOptions } from './form.options';
import { MustMatch } from '../../auth/form-validators';
import { GridModule } from 'grid';
import { FormHandler, HumanFormHandler } from './form.handler';
import { TagsInputModule } from 'tags-input';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourceTypeChangeComponent } from './resource-type-change/resource-type-change.component';
import { NgModule } from '@angular/core';
import { DialogModule } from 'src/app/ui/dialogs/dialog/dialog.module';
import { ResourcesPermissions } from './resources.module';
import { IResourcesPermissions } from './resources/resources.component';
import { GRID_COLUMN_DEFS, GRID_CONTAINER_OPTIONS, IGridContainerOptions } from '../../ui/ag-grid/grid-container/token';
import { RESOURCES_ROUTES } from './resources-routes';

const PasswordValidators = Validators.compose([
    Validators.required, Validators.minLength(6), Validators.maxLength(50),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{6,}$/),
]);


@NgModule({

    imports: [
        NgbModalModule,
        DialogModule,
        Translate,
    ],
    providers: [],
    declarations: [
        ResourceTypeChangeComponent,
    ],
    entryComponents: [
        ResourceTypeChangeComponent,
    ],
    exports: [
        ResourceTypeChangeComponent,
    ],
})
export class HumanModule {
}

@ResourcesSubModule({
    permissionCreate: PermissionsSystemLevelAction.CreateHumanResource,
    permissionUpdate: PermissionsSystemLevelAction.UpdateHumanResource,
    resourceFormConfig: {
        showApplicationsAccess: true,
        disableAvatarUpdate: true,
        disableUserNameUpdate: true,
        resourceKind: ResourceKind.Human,
        statusEditableOnCreate: false,
        statusEditableOnUpdate: true,
    },
    imports: [
        Translate.localize('human-resources'),
        VacationControlModule,
        RateControlModule,
        GridModule,
        TagsInputModule,
        HumanModule,
    ],
    providers: [

        {
            provide: FormHandler,
            useClass: HumanFormHandler,
        },
        {
            provide: Provider,
            useExisting: HumanResourcesProvider,
        },
        {
            provide: FormOptions,
            useValue: {
                disableUploader: true,
                validators: [MustMatch('password', 'confirmPassword')],
            },
        },
        {
            provide: FieldsProvider,
            useValue: Components.translate('form', [
                {
                    name: 'firstName',
                    type: 'text',
                    component: Components.Input,
                    placeholder: 'placeholder.empty',
                    validators: FieldsProvider.NameValidators,
                },
                {
                    name: 'lastName',
                    type: 'text',
                    component: Components.Input,
                    placeholder: 'placeholder.empty',
                    validators: FieldsProvider.NameValidators,
                },
                FieldsProvider.getCodeControl(),
                {
                    name: 'email',
                    type: 'email',
                    placeholder: 'placeholder.empty',

                    component: Components.Input,
                    validators: [Validators.required, Validators.email],
                },
                [
                    {
                        component: Components.Autocomplete,
                        name: 'locationId',
                        placeholder: 'placeholder.select',
                        label: 'location',
                        provider: LocationsProvider
                    },
                    {
                        component: Components.Input,
                        name: 'phone',
                        placeholder: 'placeholder.mobile',

                        validators: [
                            // TODO make validation to not allow user to enter characters
                            /*  ({value}) => value && (!value.match(/^\+/) && {plusFirstly: false}),
                              ({value}) => value && (value.length !== 13 && {length: false}), // 13 with +
                              ({value}) => value && (!value.match(/^(\+[0-9]{12})$/) && {numbers: false}),*/
                        ],
                    },
                ],
                {
                    label: 'type',
                    name: 'typeId',
                    placeholder: 'placeholder.startTyping',
                    component: Components.Autocomplete,
                    provider: ResourcesTypeProvider,
                    validators: [Validators.required],
                },
                [
                    {
                        component: 'rate-control',
                        label: 'internalRate',
                        name: 'costRate',
                    },
                    {
                        component: 'rate-control',
                        name: 'billableRate',
                        validators: [
                            (formControl: FormGroup) => {
                                const {value, currency} = formControl.value || {} as any;

                                if (value == null || currency == null) {
                                    return {required: true};
                                }
                            },
                        ],
                    },
                ],
                {
                    component: 'tags-input',
                    name: 'skills',
                    placeholder: 'placeholder.skills',
                    provider: SkillsProvider,
                },
                FieldsProvider.getResponsibleControl(),
                {
                    ...FieldsProvider.getStatusControl(HumanResourceStatus, null),
                    readonly: true,
                },
                Components.divider(),
                [
                    FieldsProvider.getAvailabilityControl(),
                    {
                        component: 'vacation-control',
                        name: 'vacation',
                    },
                ],
            ]),
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: [
                idColDef,
                {
                    ...nameColDef,
                    suppressMenu: true,
                    width: 100,
                },
                locationColDef,
                resourceIdColDef,
                {
                    field: 'email',
                },
                {
                    field: 'phone',
                },
                responsibleColDef,
                {
                    ...statusColDef,
                    suppressMenu: true,
                },
            ]
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                hiddenColumns: [
                    'code',
                    'email',
                    'phone',
                ]
            } as IGridContainerOptions<IHumanResource>,
        },
        {
            provide: ResourcesPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<IResourcesPermissions>(PermissionsHumanResourcesAction, RESOURCES_ROUTES.human),
        },
    ],
})
export class HumanResourcesModule {
}
