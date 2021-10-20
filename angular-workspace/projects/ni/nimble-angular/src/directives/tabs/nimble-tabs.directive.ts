import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Tabs } from '@ni/nimble-components/dist/esm/tabs';

/**
 * Directive to provide Angular integration for the tabs element.
 */
@Directive({
    selector: 'nimble-tabs'
})
export class NimbleTabsDirective {
    @HostBinding('attr.activeid') @Input() public activeid: string;
    @Output() public activeidChange = new EventEmitter<string>();

    public constructor(private readonly tabs: ElementRef<Tabs>) {
    }

    @HostListener('change')
    private onChange(): void {
        this.activeidChange.emit(this.tabs.nativeElement.activeid);
    }
}
