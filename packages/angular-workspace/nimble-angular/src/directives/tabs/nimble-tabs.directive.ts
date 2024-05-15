import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { type Tabs, tabsTag } from '@ni/nimble-components/dist/esm/tabs';

export type { Tabs };
export { tabsTag };

/**
 * Directive to provide Angular integration for the tabs element.
 */
@Directive({
    selector: 'nimble-tabs'
})
export class NimbleTabsDirective {
    public get activeid(): string {
        return this.elementRef.nativeElement.activeid;
    }

    @Input() public set activeid(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'activeid', value);
    }

    @Output() public activeidChange = new EventEmitter<string>();

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tabs>) {}

    @HostListener('change', ['$event'])
    public onChange($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.activeidChange.emit(this.activeid);
        }
    }
}
