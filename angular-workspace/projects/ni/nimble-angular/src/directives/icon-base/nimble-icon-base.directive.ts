import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import type { IconSeverity } from '@ni/nimble-components/dist/esm/icon-base/types';

/**
 * Base class for the nimble icon directives
 */
@Directive()
export class NimbleIconBaseDirective {
    public get severity(): IconSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input() public set severity(value: IconSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Icon>) {}
}
