import {
    AfterViewInit,
    Component, ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { IResource } from 'communication';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs/operators';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface IMentionsSubmitEvent {
    mentions: IResource[];
    inputText: string;
}

@Component({
    selector: 'app-mentions-input',
    templateUrl: 'mentions-input.component.html',
    styleUrls: ['mentions-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => MentionsInputComponent),
        },
    ],
})
export class MentionsInputComponent implements OnInit, OnDestroy, ControlValueAccessor, AfterViewInit {
    @Input() placeholder = 'Write a comment...';
    @Input() resources: IResource[];
    @Input() editItem: string;
    @Input() edit = false;

    @Output() send = new EventEmitter<IMentionsSubmitEvent>();
    @Output() cancelEdit: EventEmitter<void> = new EventEmitter();
    @ViewChild('textareaInput', {static: false}) textareaInput: ElementRef;

    showAutocomplete = false;
    foundResources: IResource[] = [];
    control = new FormControl('');

    readonly mentionsRegExp = new RegExp(/(\B@\S*)/g);

    private _mentions: IResource[] = [];
    private _matchList: RegExpMatchArray[] = [];

    public onChange = (value: any) => {
    };
    public onTouched = () => {
    };

    get inputValue() {
        return this.control.value || '';
    }

    set inputValue(value: string) {
        this.writeValue(value);
    }

    ngOnInit() {
        this.control.valueChanges.pipe(
            debounceTime(200),
            untilDestroyed(this),
        ).subscribe((value) => this._handleInputChange(value));
    }

    ngAfterViewInit(): void {
        if (this.editItem) {
            this.control.setValue(this.editItem);
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.control.disable();
    }

    writeValue(text: string) {
        this.control.setValue(text);
    }

    sendMessage() {
        this.send.emit({
            mentions: this._mentions,
            inputText: this.inputValue,
        });
    }

    selectMention(resource: IResource) {
        const currentMatch = this._getTypingMatch();

        this.inputValue = `${this.inputValue.slice(0, currentMatch.index)}@${getMentionName(resource)} `;
        this._matchList = this._getMatchArray();
        this._updateMentionList();
        this.showAutocomplete = false;
        this.textareaInput.nativeElement.focus();
    }

    private _handleInputChange(value) {
        this._matchList = this._getMatchArray();
        this.foundResources = this._findResources();
        this.showAutocomplete = !!this.foundResources.length;

        this._updateMentionList();
        this.onChange(value);
    }

    private _findResources(): IResource[] {
        for (const match of this._matchList) {
            if (!this._isMatchTyping(match)) continue;

            const searchQuery = getMatchQuery(match).slice(1);

            const resources = (this.resources || []).filter((resource) => {
                return getMentionName(resource).toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (resources.length) return resources;
        }

        return [];
    }

    private _isMatchTyping(match: RegExpMatchArray): boolean {
        return (match.index + (getMatchQuery(match).length - 1)) === (this.inputValue.length - 1);
    }

    private _getTypingMatch(): RegExpMatchArray {
        return this._matchList.find(match => this._isMatchTyping(match));
    }

    private _getMatchArray(): RegExpMatchArray[] {
        const match = this.inputValue['matchAll'](this.mentionsRegExp);

        return Array.from(match, m => m) as RegExpMatchArray[];
    }

    private _updateMentionList(): void {
        this._mentions = (this.resources || []).filter(mention => {
            return this._matchList.some(match => getMatchQuery(match) === `@${getMentionName(mention)}`);
        });
    }

    ngOnDestroy() {
        // need for untilDestroy operator
    }
}

function getMatchQuery(match: RegExpMatchArray): string {
    return match ? match[1] : null;
}

export function getMentionName(resource: IResource): string {
    return resource.firstName + '_' + resource.lastName;
}
