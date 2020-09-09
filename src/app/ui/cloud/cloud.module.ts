import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudUploadComponent } from './cloud-upload.component';
import { DragDropDirective } from './directive/DragAndDropDirective';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Translate } from 'translate';

@NgModule({
    declarations: [
        CloudUploadComponent,
        DragDropDirective,
    ],
    entryComponents: [
        CloudUploadComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        Translate.localize('profile'),
    ],
    exports: [
        CloudUploadComponent,
    ],
})
export class CloudModule {
}
