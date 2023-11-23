import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type MappingUser, mappingUserTag } from '@ni/nimble-components/dist/esm/mapping/user';
import type { MappingUserKey } from '@ni/nimble-components/dist/esm/mapping/base/types';

export type { MappingUser, MappingUserKey };
export { mappingUserTag };

/**
 * Directive to provide Angular integration for the mapping user element used by the rich-text-mention-users element.
 */
@Directive({
    selector: 'nimble-mapping-user'
})
export class NimbleMappingUserDirective {
    public get key(): string | undefined {
        return this.elementRef.nativeElement.key;
    }

    @Input() public set key(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'key', value);
    }

    public get displayName(): string | undefined {
        return this.elementRef.nativeElement.displayName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('display-name') public set displayName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'displayName', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<MappingUser>) {}
}
