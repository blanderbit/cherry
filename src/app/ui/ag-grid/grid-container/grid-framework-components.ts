// import { GridCustomFilterComponent } from '../grid-custom-filter/custom-filter.component';
import { AvatarsStackComponent } from '../../../user/avatars-stack/avatars-stack.component';
import { ProgressComponent } from '../progress/progress.component';
import { LinkComponent } from '../components/link.component';
import { CustomNoRowsOverlayComponent } from '../components/no-rows-overlay.component';
import { ProjectNameComponent } from '../components/projectName.component';
import { GridCustomFilterComponent } from '../grid-custom-filter/custom-filter.component';
import { GridCellComponent } from '../gird-cell/grid-cell.component';

export const GRID_FRAMEWORKS = {
    // customFilter: TestFilterComponent,
    // agColumnHeader: GridHeaderComponent,
    gridCellComponent: GridCellComponent,
    customFilter: GridCustomFilterComponent,
    avatarsStack: AvatarsStackComponent,
    progressComponent: ProgressComponent,
    linkComponent: LinkComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    checkboxSelection: (params): boolean => {
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        return displayedColumns[0] === params.column;
    },
    projectNameComponent: ProjectNameComponent,
};
