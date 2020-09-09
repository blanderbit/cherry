import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatusComponent } from './project-status.component';
import { Translate } from 'translate';

const COMPONENTS = [ProjectStatusComponent];

@NgModule({
    declarations: [
        ProjectStatusComponent
    ],
    imports: [
        CommonModule,
        Translate.localize('projects'),
    ],
    exports: [
        ProjectStatusComponent
    ],
    entryComponents: [
        ProjectStatusComponent,
    ]
})
export class ProjectStatusModule {
}
