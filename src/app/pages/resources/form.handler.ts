import { FormComponent } from 'components';
import { IResource, ProjectStatus, ResourcesTypeProvider } from 'communication';
import { IFieldConfig } from 'dynamic-form-control';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { filter, switchMap } from 'rxjs/operators';
import { NotifierService } from 'notifier';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourceTypeChangeComponent } from './resource-type-change/resource-type-change.component';
import { IRateControlParams } from './rate-control/rate-control.component';

interface IResourcesForm extends FormComponent<IResource> {
    formControls: IFieldConfig[];
    canUpload: boolean;
}

export abstract class FormHandler {
    handleFormInit(component: IResourcesForm) {

    }

    handleComponentInit(component: IResourcesForm) {

    }
}

@Injectable()
export class HumanFormHandler extends FormHandler {
    constructor(private resourceTypeProvider: ResourcesTypeProvider,
                private dialogService: NgbModal,
                private notifier: NotifierService,
    ) {
        super();
    }

    handleComponentInit(component: IResourcesForm) {
        const form = component.form;
        const typeControl = form.get('typeId');
        const billableRateControl = form.get('billableRate');

        typeControl.valueChanges.pipe(
            filter(v => v != null && !component.initializing),
            switchMap(id => this.resourceTypeProvider.getItemById(id))
        ).subscribe(v => {
            const ref = this.dialogService.open(ResourceTypeChangeComponent);

            ref.result.then((confirmed) => {
                    billableRateControl.patchValue({
                        value: v.rate,
                        currency: v.currency,
                    } as IRateControlParams);

            }).catch(() => {});
        });
    }

    handleFormInit(component: IResourcesForm) {
        if (!component.needCreate) {
            const form = component.form;
            const controls = [form.get('email'), form.get('role')];

            controls.filter(Boolean).forEach(c => c.disable());

            component.formControls = component.formControls.filter(isNotPasswordField);
            form.removeControl('password');
            form.removeControl('confirmPassword');
        }

    }
}

export class GenericFormHandler extends FormHandler {
    handleComponentInit(component: IResourcesForm) {
        component.canUpload = false;
    }
}

function isNotPasswordField({name}) {
    return name !== 'password' && name !== 'confirmPassword';
}
