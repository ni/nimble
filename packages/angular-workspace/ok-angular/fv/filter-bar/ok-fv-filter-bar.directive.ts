import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvFilterBar } from '@ni/ok-components/dist/esm/fv/filter-bar';
import { fvFilterBarTag } from '@ni/ok-components/dist/esm/fv/filter-bar';
import type {
    FvFilterBarDefinition,
    FvFilterBarQueryDocument
} from '@ni/ok-components/dist/esm/fv/filter-bar/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvFilterBar };
export { fvFilterBarTag };
export type { FvFilterBarDefinition, FvFilterBarQueryDocument };

/** Angular bindings for the FV filter bar. */
@Directive({
    selector: 'ok-fv-filter-bar',
    standalone: false
})
export class OkFvFilterBarDirective {
    @Input() public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    @Input() public set showClearButton(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'showClearButton', toBooleanProperty(value));
    }

    @Input() public set query(value: FvFilterBarQueryDocument) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'query', value);
    }

    @Input() public set definition(value: FvFilterBarDefinition | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'definition', value);
    }

    @Output() public editFilterEvent = new EventEmitter<Event>();
    @Output() public clearFilterEvent = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvFilterBar>,
        private readonly renderer: Renderer2
    ) {}

    @HostListener('edit-filter', ['$event'])
    public onEditFilter(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.editFilterEvent.emit(event);
        }
    }

    @HostListener('clear-filter', ['$event'])
    public onClearFilter(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.clearFilterEvent.emit(event);
        }
    }
}
