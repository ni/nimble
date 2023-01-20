import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { AnchorTabs } from '@ni/nimble-components/dist/esm/anchor-tabs';

export type { AnchorTabs };

/**
 * Directive to provide Angular integration for the anchor tabs element.
 */
@Directive({
    selector: 'nimble-anchor-tabs'
})
export class NimbleAnchorTabsDirective {
    public get activeid(): string {
        return this.elementRef.nativeElement.activeid ?? '';
    }

    @Input() public set activeid(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'activeid', value);
    }

    public get activetab(): HTMLElement | undefined {
        return this.elementRef.nativeElement.activetab;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<AnchorTabs>) {}
}
