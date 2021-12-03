import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { Tabs } from '@ni/nimble-components/dist/esm/tabs';

/**
 * Directive to provide Angular integration for the tabs element.
 */
@Directive({
    selector: 'nimble-tabs'
})
export class NimbleTabsDirective {
    public get activeid(): string {
        return this.el.nativeElement.activeid;
    }

    @Input() public set activeid(value: string) {
        this.renderer.setProperty(this.el.nativeElement, 'activeid', value);
    }

    @Output() public activeidChange = new EventEmitter<string>();

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<Tabs>) {}

    @HostListener('change')
    private onChange(): void {
        this.activeidChange.emit(this.el.nativeElement.activeid);
    }
}
