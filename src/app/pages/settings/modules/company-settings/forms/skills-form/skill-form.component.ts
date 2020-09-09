import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITypedFormGroup } from '../holidays-policy-form/holidays-policy-form.component';
import { CompanySettingsForm } from '../company-settings-form.component';
import { ISkill } from '../../../../../../../../projects/communication/src/lib/models/skill';

@Component({
    selector: 'app-skill-form',
    templateUrl: './skill-form.component.html',
    styleUrls: ['../company-settings-form.scss'],
})
export class SkillFormComponent extends CompanySettingsForm<ISkill> implements OnInit {
    protected createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
            ),
        } as ITypedFormGroup<ISkill>);
    }
}
