import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvMultiSelect } from '@ni/ok-components/dist/esm/fv/multi-select';
import { fvMultiSelectTag } from '@ni/ok-components/dist/esm/fv/multi-select';
import type { FvMultiSelectOption } from '@ni/ok-components/dist/esm/fv/multi-select/types';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvMultiSelect };
export { fvMultiSelectTag, DropdownAppearance };
export type { FvMultiSelectOption };

/** Angular bindings for the FV multi-select. */
@Directive({
    selector: 'ok-fv-multi-select',
    standalone: false
})
export class OkFvMultiSelectDirective {
    @Input() public set appearance(value: DropdownAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    @Input() public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    @Input() public set filterable(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'filterable', toBooleanProperty(value));
    }

    @Input() public set clearable(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'clearable', toBooleanProperty(value));
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    @Input() public set options(value: FvMultiSelectOption[]) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'options', value);
    }

    @Input() public set selectedValues(value: string[]) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectedValues', value);
    }

    @Input() public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    @Output() public inputEvent = new EventEmitter<Event>();
    @Output() public changeEvent = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvMultiSelect>,
        private readonly renderer: Renderer2
    ) {}

    @HostListener('input', ['$event'])
    public onInput(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.inputEvent.emit(event);
        }
    }

    @HostListener('change', ['$event'])
    public onChange(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.changeEvent.emit(event);
        }
    }
}
