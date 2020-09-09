import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    HostListener,
    Input, OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { KEYS } from '../../tag-input-keys';
import { AutocompleteComponent } from 'autocomplete';
import { DynamicField, IAutocompleteField } from 'dynamic-form-control';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';


@Component({
    selector: 'dynamic-tags-input',
    template: DynamicField.getFromControlTemplate(`
        <tags-input 
            [placeholder]="placeholder"
            [provider]="field.provider" 
            [formatter]="field.formatter" 
            [paramsFormatter]="field.paramsFormatter" 
            [formControlName]="formControlName"></tags-input>
    `),
})
export class DynamicTagsInputComponent extends DynamicField<IAutocompleteField<any>> {
}


/**
 * Taken from @angular/common/src/facade/lang
 */
function isBlank(obj: any): boolean {
    return obj === undefined || obj === null;
}

export interface AutoCompleteItem {
    [index: string]: any;
}

@Component({
    selector: 'tags-input',
    templateUrl: './tags-input.component.html',
    styleUrls: ['./tags-input.component.scss'],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TagsInputComponent), multi: true},
    ],
})
export class TagsInputComponent extends AutocompleteComponent implements ControlValueAccessor, OnInit {
    emitNullValues = false;
    @Input() addOnBlur: boolean = true;
    @Input() addOnComma: boolean = true;
    @Input() addOnEnter: boolean = true;
    @Input() addOnSpace: boolean = false;

    @Input() allowDuplicates: boolean = false;

    @Input() autocomplete: boolean = false;
    @Input() placeholder: string = 'Add a tag';

    @Output() addTag = new EventEmitter<string | number>();
    @Output() removeTag = new EventEmitter<string | number>();

    focus$ = new Subject<string>();
    focusout$ = new Subject<string>();

    @ViewChild('input', {static: false})
    tagInputElement: ElementRef;

    @HostBinding('class.focus')
        // TODO: Rename
    // @ts-ignore
    focus = false;

    @HostBinding('class.input')
    isInput = true;

    public tags: any[] = [];

    public selectedTag: number;

    onChange: any = () => null;

    itemsFilter = (items) => items.filter(item => {
        const getKey = (i) => typeof i === 'string' ? i : this.formatter(i);
        return !this.tags.find(tag => getKey(item) === getKey(tag));
    })

    private get input(): any {
        return this.tagInputElement && this.tagInputElement.nativeElement;
    }

    private get inputValue(): string {
        return this.input && this.input.value;
    }

    onKeydown(event: KeyboardEvent): void {
        const key = event.keyCode;
        switch (key) {
            case KEYS.backspace:
                this._handleBackspace();
                break;

            case KEYS.enter:
                // if (this.addOnEnter) {
                //     this._addTags([this.inputValue]);
                //     event.preventDefault();
                // }
                break;

            case KEYS.comma:
                if (this.addOnComma) {
                    this._addTags([this.inputValue]);
                    event.preventDefault();
                }
                break;

            case KEYS.space:
                if (this.addOnSpace) {
                    this._addTags([this.inputValue]);
                    event.preventDefault();
                }
                break;

            default:
                break;
        }
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.focusout$.pipe(untilDestroyed(this)).subscribe((value) => this.focus = false);
    }

    private _isTagValid(tagString: string): boolean {
        return this._isTagUnique(tagString);
    }

    private _isTagUnique(tagString: string): boolean {
        return this.allowDuplicates ? true : this.tags.indexOf(tagString) === -1;
    }

    private _emitTagAdded(addedTags: string[]): void {
        addedTags.forEach(tag => this.addTag.emit(+(<any>tag).id || tag));
    }

    private _emitTagRemoved(removedTag): void {
        this.removeTag.emit(removedTag);
    }

    onTagSelect(event, input): void {
        event.preventDefault();
        const {item} = event || {} as any;
        this._addTags([item]);
        this.input.value = '';
        input.value = '';
    }

    private _addTags(tags: string[]): void {
        const validTags = tags.map(tag => typeof tag === 'string' ? tag.trim() : tag)
            .filter(tag => this._isTagValid(tag))
            .filter((tag, index, tagArray) => tagArray.indexOf(tag) === index);

        this.tags = this.tags.concat(validTags);
        this._resetSelected();
        this.onChange(this.tags);
        this._emitTagAdded(validTags);
    }

    private _removeTag(tagIndexToRemove: number): void {
        const removedTag = this.tags[tagIndexToRemove];
        this.tags.splice(tagIndexToRemove, 1);
        this._resetSelected();
        this.onChange(this.tags);
        this._emitTagRemoved(removedTag);
    }

    private _handleBackspace(): void {
        if (!this.inputValue.length && this.tags.length) {
            if (!isBlank(this.selectedTag)) {
                this._removeTag(this.selectedTag);
            } else {
                this.selectedTag = this.tags.length - 1;
            }
        }
    }

    private _resetSelected(): void {
        this.selectedTag = null;
    }

    writeValue(value: any) {
        if (!Array.isArray(value))
            return;

        const tags = Array.isArray(this.tags) ? this.tags : [];
        const tagsIds = tags.map(getId);
        const newValues = value.map(getId);
        const needLoadIds = newValues
            .filter(i => tagsIds.includes(i) || value.find(item => typeof item === 'object' && item.id === i));

        if (tagsIds.length === newValues.length && needLoadIds.length === 0)
            return;

        const getValues = (items?) => {
            return newValues.map(i => {
                const fn = findById(i);
                const item = Array.isArray(items) && items.find(fn);

                return item || tags.find(fn) || value.find(fn);
            }).filter(Boolean);
        };

        if (needLoadIds.length)
            this.provider.getItemsByIds(needLoadIds).subscribe(
                (items) => this.tags = getValues(items),
                (error) => console.error(error),
            );
        else {
            this.tags = getValues();
        }


        /**
         * todo
         * this is not good solution for skills
         * because skills comes as array of object but need returns array of ids
         * In the future needs gets skills ids and load skills by ids
         *
         *
         * set timeout fix ssr issue
         * because on change  called before then its setted in registerOnChange
         * */
        if (value.some(i => typeof i === 'object'))
            setTimeout(() => this.onChange(newValues));
    }

    registerOnChange(fn: any) {
        this.onChange = (items) => fn(items && items.map(getId).filter(Boolean));
    }
}

function getId(i) {
    return typeof i === 'object' ? i.id : i;
}

function findById(id) {
    return ({id: _id}) => _id === id;
}
