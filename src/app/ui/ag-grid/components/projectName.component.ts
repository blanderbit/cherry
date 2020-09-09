import { Component } from '@angular/core';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { ProjectsProvider } from 'communication';

@Component({
    template:   `<span>{{name}}</span>`,
})
export class ProjectNameComponent {

    constructor(
        protected _provider: ProjectsProvider,
        protected _notifier: NotifierService) { }

    name: string;
    params: any;

    agInit(params: any): void {
        this.params = params.value;
        this._getName(this.params);
    }

    protected _getName(id: number) {
        return this._provider.getItemById(id).subscribe(
            res => this.name = res.name,
            er => this._notifier.showError('action.no-project')
        );
    }

}
