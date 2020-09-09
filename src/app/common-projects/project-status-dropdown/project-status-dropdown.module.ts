import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatusDropdownComponent } from './project-status-dropdown.component';
import { FormControlModule } from 'form-control';
import { PermissionsModule } from 'permissions';
import { Translate } from 'translate';
import { SelectModule } from '../../ui/select/select.module';

@NgModule({
    imports: [
        CommonModule,
        FormControlModule,
        PermissionsModule,
        SelectModule,
        Translate
    ],
    declarations: [
        ProjectStatusDropdownComponent,
    ],
    exports: [
        ProjectStatusDropdownComponent
    ],
})
export class ProjectStatusDropdownModule {}
