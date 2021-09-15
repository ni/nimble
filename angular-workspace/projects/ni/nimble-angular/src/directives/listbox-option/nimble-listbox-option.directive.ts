import { Directive, ElementRef, Host, HostBinding, Input, OnDestroy, Optional, Renderer2 } from '@angular/core';
import { NimbleSelectControlValueAccessor } from '../select';

@Directive({
    selector: 'nimble-listbox-option'
})
export class NimbleListboxOptionDirective implements OnDestroy {
    @HostBinding('attr.value') @Input() public value: string;
    @HostBinding('attr.disabled') @Input() public disabled: boolean;

    public id: string;

    public constructor(
        private readonly element: ElementRef, private readonly renderer: Renderer2,
        @Optional() @Host() private readonly select: NimbleSelectControlValueAccessor
    ) {
        if (this.select) this.id = this.select.registerOption();
    }

    /**
    * @description
    * Tracks the value bound to the option element. Unlike the value binding,
    * ngValue supports binding to objects.
    */
    @Input('ngValue')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public set ngValue(value: any) {
        if (this.select == null) return;
        this.select.optionMap.set(this.id, value);
        this.value = NimbleSelectControlValueAccessor.buildValueString(this.id, value);
        this.select.writeValue(this.select.value);
    }

    public ngOnDestroy(): void {
        if (this.select) {
            this.select.optionMap.delete(this.id);
            this.select.writeValue(this.select.value);
        }
    }
}
