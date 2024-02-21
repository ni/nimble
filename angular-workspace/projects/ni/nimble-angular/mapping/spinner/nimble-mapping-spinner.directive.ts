import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NimbleMappingDirective } from '@ni/nimble-angular/mapping/base';
import { type MappingSpinner, mappingSpinnerTag } from '@ni/nimble-components/dist/esm/mapping/spinner';
import type { MappingKey } from '@ni/nimble-components/dist/esm/mapping/base/types';

export type { MappingSpinner };
export { mappingSpinnerTag };

/**
 * Directive to provide Angular integration for the mapping spinner element used by the spinner column.
 */
@Directive({
    selector: 'nimble-mapping-spinner'
})
export class NimbleMappingSpinnerDirective extends NimbleMappingDirective<MappingKey> {
    public get text(): string | undefined {
        return this.elementRef.nativeElement.text;
    }

    @Input() public set text(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'text', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingSpinner>) {
        super(renderer, elementRef);
    }
}