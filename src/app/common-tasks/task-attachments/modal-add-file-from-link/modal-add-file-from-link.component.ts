import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Translate } from 'translate';

@Component({
    selector: 'app-modal-add-file-from-link',
    templateUrl: './modal-add-file-from-link.component.html',
    styleUrls: ['./modal-add-file-from-link.component.scss'],
    providers: [
        ...Translate.localizeComponent('task-comments'),
    ],
})
export class ModalAddFileFromLinkComponent {
    title: string;
    url: string;
    form: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        public modal: NgbActiveModal) {
        this.form = formBuilder.group({
            title: ['', [Validators.maxLength(256)]],
            url: ['', [Validators.maxLength(4096), Validators.required]],
        });
    }

    newLink = () => {
        if (this.form.valid) {
            const title = this.title ? this.title.trim() : this.url.substr(0, 256);
            return { title: title, url: this.url };
        }
    }

    getError(control: string) {
        const errors = this.form.get(control).errors;
        return errors ? ('form.errors.' + Object.keys(errors)[0]) : null;
    }

    showError(control: string) {
        return this.form.get(control).invalid && this.form.get(control).touched;
    }
}
