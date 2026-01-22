import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { type Chip, chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Chip };
export { chipTag };
export { ChipAppearance };

/**
 * Directive to provide Angular integration for the chip.
 */
@Directive({
    selector: 'nimble-chip',
    standalone: false
})
export class NimbleChipDirective {
    public get removable(): boolean {
        return this.elementRef.nativeElement.removable;
    }

    @Input() public set removable(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'removable', toBooleanProperty(value));
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get appearance(): ChipAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: ChipAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    @Output() public removeEvent = new EventEmitter<void>();

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Chip>) {}

    @HostListener('remove', ['$event'])
    public onRemove($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.removeEvent.emit();
        }
    }
}
