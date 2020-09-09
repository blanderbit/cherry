import { Component, Input } from '@angular/core';
import { IProjectWithCreator } from '../../details-wrapper/project-details-container.component';
import { AnyResource, IHumanResource, IResource, IRole } from 'communication';

@Component({
    selector: 'app-resource-list',
    templateUrl: './resources-list.component.html',
    styleUrls: ['./resources-list.component.scss'],
})
export class ResourcesListComponent {
    @Input() items: IResource[];
    @Input() project: IProjectWithCreator;
    @Input() roles: IRole[];
    @Input() title: string;

    getRole(user: IResource) {
        if (this.project && this.project.members) {
            const member = this.project.members.find(item => item.id === user.id);
            if (member && member.roleId && this.roles) {
                return this.roles.find(item => item.id === +member.roleId);
            }
        }
    }
}
