import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type MappingMention, mappingMentionTag } from '@ni/nimble-components/dist/esm/mapping/mention';
import type { MappingKey } from '@ni/nimble-components/dist/esm/mapping/base/types';

export type { MappingMention, MappingKey };
export { mappingMentionTag };

/**
 * Directive to provide Angular integration for the mapping text element used by the enum-text column.
 */
@Directive({
    selector: 'nimble-mapping-mention'
})
export class NimbleMappingMentionDirective {
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

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingMention>) {}
}
