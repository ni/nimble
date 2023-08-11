import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type MappingText, mappingTextTag } from '@ni/nimble-components/dist/esm/mapping/text';
import type { MappingKey } from '@ni/nimble-components/dist/esm/mapping/base/types';

export type { MappingText, MappingKey };
export { mappingTextTag };

/**
 * Directive to provide Angular integration for the mapping text element used by the enum-text column.
 */
@Directive({
    selector: 'nimble-mapping-text'
})
export class NimbleMappingTextDirective {
    public get key(): MappingKey | undefined {
        return this.elementRef.nativeElement.key;
    }

    @Input() public set key(value: MappingKey | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'key', value);
    }

    public get text(): string | undefined {
        return this.elementRef.nativeElement.text;
    }

    @Input() public set text(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'text', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingText>) {}
}
