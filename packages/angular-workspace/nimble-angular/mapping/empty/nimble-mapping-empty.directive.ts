import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NimbleMappingDirective } from '@ni/nimble-angular/mapping/base';
import { type MappingEmpty, mappingEmptyTag } from '@ni/nimble-components/dist/esm/mapping/empty';
import type { MappingKey } from '@ni/nimble-components/dist/esm/mapping/base/types';

export type { MappingEmpty, MappingKey };
export { mappingEmptyTag };

/**
 * Directive to provide Angular integration for the mapping empty element used by the mapping column.
 */
@Directive({
    selector: 'nimble-mapping-empty'
})
export class NimbleMappingEmptyDirective extends NimbleMappingDirective<MappingKey> {
    public get text(): string | undefined {
        return this.elementRef.nativeElement.text;
    }

    @Input() public set text(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'text', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingEmpty>) {
        super(renderer, elementRef);
    }
}
