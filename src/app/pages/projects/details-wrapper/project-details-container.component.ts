import { Component, forwardRef, InjectionToken } from '@angular/core';
import {
    IHumanResource,
    IOptionalPermissionActionProvider
} from 'communication';
import { LoadingComponent, ProjectDetailsComponent } from 'components';
import { IItem } from 'menu';
import { PERMISSIONS_DIRECTIVE_DATA } from 'permissions';
import { IProject } from 'projects/communication/src/lib/models/projects/project';

export interface IMenuItemsContainer {
    menuItems: IItem[];

    setItems(items: IItemWithPermissionAction[]): void;
}

export interface IItemWithPermissionAction extends IItem, IOptionalPermissionActionProvider {
}

export interface IProjectWithCreator extends IProject {
    creator: IHumanResource;
}

export interface IProjectMenuItemsContainer extends IMenuItemsContainer {
    triggerNameEdit?(): void;

    getDeleteMenuItem(): IItemWithPermissionAction;

    delete(): void;
}

export const MenuItemsContainer = new InjectionToken<IMenuItemsContainer>('Menu items container');

@Component({
    selector: 'app-project-details-container',
    templateUrl: './project-details-container.component.html',
    styleUrls: ['./project-details-container.component.scss'],
    providers: [
        {
            provide: MenuItemsContainer,
            useExisting: ProjectDetailsContainerComponent,
        },
        {
            provide: LoadingComponent,
            useExisting: ProjectDetailsContainerComponent,
        },
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => ProjectDetailsContainerComponent),
        },
    ],
})
export class ProjectDetailsContainerComponent extends ProjectDetailsComponent<IProjectWithCreator> {
}


