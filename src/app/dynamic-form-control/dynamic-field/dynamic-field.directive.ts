import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive, Inject,
    Input,
    OnDestroy,
    OnInit, Type,
    ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Components, IFieldConfig } from '../components';
import { IDynamicField } from '../field';
import { DynamicComponents } from '../dynamic.components';

@Directive({
    selector: '[dynamicField]'
})
export class DynamicFieldDirective<T extends IDynamicField = IDynamicField> implements OnInit, OnDestroy {

    @Input()
    set dynamicField(config: IFieldConfig) {
        this.field = config;
    }

    @Input()
    field: IFieldConfig;

    @Input()
    group: FormGroup;

    componentRef: ComponentRef<IDynamicField>;

    constructor(private resolver: ComponentFactoryResolver,
                @Inject(DynamicComponents) private dynamicComponents: any[],
                private container: ViewContainerRef) {
    }

    ngOnInit() {
        const _class = this._getComponentClass();
        const factory = this.resolver.resolveComponentFactory<T>(_class);
        const ref: ComponentRef<IDynamicField> = this.container.createComponent<T>(factory);

        ref.instance.field = this.field;

        this.componentRef = ref;
    }

    private _getComponentClass(): Type<T> {
        const field = this.field;
        const component = Array.isArray(field) ? Components.Row : field.component;

        const store = this.dynamicComponents.find(item => typeof item[component] === 'function');

        return store && store[component];
    }

    ngOnDestroy(): void {
        try {
            if (this.componentRef)
                this.componentRef.destroy();
        } catch (e) {
            console.error('Can\'t destroy component (DynamicFieldDirective)', e);
        }
    }
}
