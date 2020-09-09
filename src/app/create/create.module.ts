import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './components/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Translate } from 'translate';
import { AgileProjectsCreateService, ProjectsCreateService } from './projects-create.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from 'form-control';
import { TasksCreateService } from './tasks-create.service';
import { LoaderModule } from 'loader';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatepickerModule } from '../date/datepicker';
import { RadioButtonModule } from '../ui/radio-button/radio-button.module';
import { ProjectStatusDropdownModule } from '../common-projects/project-status-dropdown/project-status-dropdown.module';

@NgModule({
    declarations: [
        CreateComponent,
    ],
    entryComponents: [
        CreateComponent,
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    FormControlModule,
    Translate,
    LoaderModule,
    TextFieldModule,
    DatepickerModule,
    RadioButtonModule,
    ProjectStatusDropdownModule,
  ],
    exports: [NgbModule]
})
export class CreateModule {
    static forProjects(): ModuleWithProviders {
        return {
            ngModule: CreateModule,
            providers: [
                ProjectsCreateService,
            ]
        };
    }

    static forBoard(): ModuleWithProviders {
        return {
            ngModule: CreateModule,
            providers: [
                AgileProjectsCreateService,
            ]
        };
    }

    static forTasks(): ModuleWithProviders {
        return {
            ngModule: CreateModule,
            providers: [
                TasksCreateService,
            ]
        };
    }
}
