/// <reference lib="es2017.intl" />

import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvDateTimePicker } from '@ni/ok-components/dist/esm/fv/date-time-picker';
import { fvDateTimePickerTag } from '@ni/ok-components/dist/esm/fv/date-time-picker';
import {
    FvDateTimePickerAppearance,
    FvDateTimePickerType
} from '@ni/ok-components/dist/esm/fv/date-time-picker/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvDateTimePicker };
export { fvDateTimePickerTag, FvDateTimePickerAppearance, FvDateTimePickerType };

/** Angular bindings for the FV date-time picker. */
@Directive({
    selector: 'ok-fv-date-time-picker',
    standalone: false
})
export class OkFvDateTimePickerDirective {
    @Input() public set appearance(value: FvDateTimePickerAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    @Input() public set type(value: FvDateTimePickerType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    @Input() public set min(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'min', value);
    }

    @Input() public set max(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'max', value);
    }

    @Input() public set step(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'step', value);
    }

    @Input() public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    @Input() public set autofocus(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'autofocus', toBooleanProperty(value));
    }

    @Input() public set autocomplete(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'autocomplete', value);
    }

    @Input() public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    @Input() public set fullBleed(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fullBleed', toBooleanProperty(value));
    }

    @Input() public set appearanceReadOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceReadOnly', toBooleanProperty(value));
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    @Input() public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    @Input() public set required(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'required', toBooleanProperty(value));
    }

    @Output() public inputEvent = new EventEmitter<Event>();
    @Output() public changeEvent = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvDateTimePicker>,
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
