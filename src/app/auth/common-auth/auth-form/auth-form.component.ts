import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-auth-form',
    templateUrl: './auth-form.component.html',
    styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
    @Input()
    public padding = true;

    @Input()
    formGroup: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }

}
