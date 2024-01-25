import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NimbleMappingDirective } from '@ni/nimble-angular/mapping/base';
import { type MappingIcon, mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import type { MappingKey } from '@ni/nimble-components/dist/esm/mapping/base/types';
import type { IconSeverity } from '@ni/nimble-components/dist/esm/icon-base/types';

export type { MappingIcon };
export { mappingIconTag };

/**
 * Directive to provide Angular integration for the mapping icon element used by the icon column.
 */
@Directive({
    selector: 'nimble-mapping-icon'
})
export class NimbleMappingIconDirective extends NimbleMappingDirective<MappingKey> {
    public get text(): string | undefined {
        return this.elementRef.nativeElement.text;
    }

    @Input() public set text(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'text', value);
    }

    public get icon(): string | undefined {
        return this.elementRef.nativeElement.icon;
    }

    @Input() public set icon(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'icon', value);
    }

    public get severity(): IconSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input() public set severity(value: IconSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingIcon>) {
        super(renderer, elementRef);
    }
}