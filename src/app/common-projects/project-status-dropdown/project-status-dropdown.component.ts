import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { numbersFromEnum } from 'components';
import { IProject, ProjectStatus } from 'communication';
import { IItem } from 'menu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Translate } from 'translate';
import { ArchiveProjectComponent } from '../archive-project/archive-project.component';

const ALL_STATUSES = numbersFromEnum(ProjectStatus);

@Component({
    selector: 'app-project-status-dropdown',
    templateUrl: 'project-status-dropdown.component.html',
    styleUrls: ['project-status-dropdown.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProjectStatusDropdownComponent),
            multi: true,
        },
        Translate.localizeComponent('projects'),
    ]
})
export class ProjectStatusDropdownComponent implements ControlValueAccessor {
    @Input() options: ProjectStatus[] = ALL_STATUSES;
    @Input() project: IProject;

    @Output() statusChange = new EventEmitter<ProjectStatus>();

    ProjectStatus = ProjectStatus;
    private _disabled = false;
    private _value: ProjectStatus;

    onChange = (_) => {
    }
    onTouch = () => {
    }

    get value() {
        return this._value;
    }

    constructor(private _ngbModal: NgbModal,
                private _formContainer: ControlContainer) {
    }

    onProjectStatusSelect = (result: IItem) => {
        if (result.value === ProjectStatus.Archived) {
            const instance = this._ngbModal.open(ArchiveProjectComponent);
            (<ArchiveProjectComponent>instance.componentInstance).project = this.project;
            instance.result.then(() => this._changeStatus(result.value as ProjectStatus)).catch(() => { });
        } else {
            this._changeStatus(result.value as ProjectStatus);
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this._value = obj;
    }

    private _changeStatus(value: ProjectStatus) {
        this.writeValue(value);
        this.onChange(value);
        this.statusChange.emit(value);
    }
}
