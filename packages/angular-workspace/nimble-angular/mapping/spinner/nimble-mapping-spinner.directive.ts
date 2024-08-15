import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NimbleMappingDirective } from '@ni/nimble-angular/mapping/base';
import { type MappingSpinner, mappingSpinnerTag } from '@ni/nimble-components/dist/esm/mapping/spinner';
import type { MappingKey } from '@ni/nimble-components/dist/esm/mapping/base/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

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

    public get textHidden(): boolean {
        return this.elementRef.nativeElement.textHidden;
    }

    @Input('text-hidden') public set textHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'textHidden', toBooleanProperty(value));
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingSpinner>) {
        super(renderer, elementRef);
    }
}