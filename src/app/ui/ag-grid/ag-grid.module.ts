import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressComponent } from './progress/progress.component';
import { Translate } from 'translate';
import { LinkComponent } from './components/link.component';
import { RouterModule } from '@angular/router';
import { UserModule } from '../../user/user.module';
import { AvatarsStackComponent } from '../../user/avatars-stack/avatars-stack.component';
import { ProjectNameComponent } from './components/projectName.component';
import { CustomNoRowsOverlayComponent } from './components/no-rows-overlay.component';
import { GridContainerComponent } from './grid-container/grid-container.component';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';
import { PaginatorComponent } from './paginator/paginator.component';
import { SelectModule } from '../select/select.module';
import { GridCustomFilterComponent } from './grid-custom-filter/custom-filter.component';
import { GridCellComponent } from './gird-cell/grid-cell.component';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { EffortComponent } from './effort/effort.component';
import { UserSummaryComponent } from '../../user/user-summary/user-summary.component';
import { AvatarComponent } from '../../user/avatar/avatar.component';
import { GridCellValueMapperComponent } from './grid-country/grid-cell-value-mapper.component';
import { EditableCellComponent } from './editable-cell/editable-cell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from 'form-control';
import { HighlightComponent } from './highlight/highlight.component';
import { UiModule } from '../ui.module';
import { StatusCellComponent } from './status-cell/status-cell.component';
import { DateModule, DatepickerModule } from 'date';

@NgModule({
    declarations: [
        ProgressComponent,
        LinkComponent,
        ProjectNameComponent,
        CustomNoRowsOverlayComponent,
        GridContainerComponent,
        PaginatorComponent,
        GridCustomFilterComponent,
        GridCellComponent,
        EffortComponent,
        EditableCellComponent,
        GridCellValueMapperComponent,
        HighlightComponent,
        StatusCellComponent,
    ],
    exports: [
        ProgressComponent,
        LinkComponent,
        GridContainerComponent,
        GridCustomFilterComponent,
        GridCellComponent,
        EffortComponent,
        PaginatorComponent,
    ],
    entryComponents: [
        LinkComponent,
        ProjectNameComponent,
        CustomNoRowsOverlayComponent,
        GridCustomFilterComponent,
        GridCellComponent,
        EffortComponent,
        UserSummaryComponent,
        AvatarComponent,
        HighlightComponent,
        GridCellValueMapperComponent,
        StatusCellComponent
    ],
  imports: [
    NgbModule,
    CommonModule,
    RouterModule,
    AgGridModule.withComponents([
      ProgressComponent,
      LinkComponent,
      AvatarsStackComponent,
      ProjectNameComponent,
      CustomNoRowsOverlayComponent,
      EditableCellComponent,
      StatusCellComponent,
    ]),
    Translate,
    UserModule,
    CustomDirectivesModule,
    SelectModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FormControlModule,
    AgGridModule,
    DatepickerModule,
    UiModule,
    DateModule
  ],
    providers: [],
})
export class GridModule {
    static withComponents(components?: any): ModuleWithProviders {
        return {
            ngModule: GridModule,
            providers: [
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true}
            ],
        };
    }

}

