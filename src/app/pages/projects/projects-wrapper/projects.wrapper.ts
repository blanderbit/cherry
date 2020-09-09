import { Component } from '@angular/core';
import { CommunicationModule } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { IProjectIdProvider } from '../../../permissions/services/projects-permissions-manager.service';
import { ProjectIdProvider } from '../shttp.service';


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'projects-wrapper',
    template: '<router-outlet></router-outlet>',
    providers: [
        ...CommunicationModule.forProjectsPermissions(),
        {
            provide: ProjectIdProvider,
            useExisting: ProjectsWrapperComponent,
        }
    ]
})
export class ProjectsWrapperComponent implements IProjectIdProvider {
    get projectId() {
        console.log('ID', (<{id: number}>this.route.snapshot.params).id);
        return (<{id: number}>this.route.snapshot.params).id;
    }

    constructor(private router: Router, private route: ActivatedRoute) {
    }
}

