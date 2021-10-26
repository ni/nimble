import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Drawer } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation, DrawerState } from '@ni/nimble-components/dist/esm/drawer/types';

export type { Drawer };
export { DrawerLocation, DrawerState };

/**
 * Directive to provide Angular integration for the drawer.
 */
@Directive({
    selector: 'nimble-drawer'
})
export class NimbleDrawerDirective {
    @HostBinding('location') @Input() public location: DrawerLocation = DrawerLocation.Left;
    @HostBinding('state') @Input() public state: DrawerState = DrawerState.Closed;
    @HostBinding('modal') @Input() public modal = true;

    @Output() public stateChange = new EventEmitter<DrawerState>();

    public constructor(private readonly drawerReference: ElementRef<Drawer>) {
    }

    public show(): void {
        this.state = DrawerState.Opening;
    }

    public hide(): void {
        this.state = DrawerState.Closing;
    }

    @HostListener('state-change', ['$event'])
    private onStateChanged($event: Event): void {
        const drawer = this.drawerReference.nativeElement;
        if ($event.target === drawer) {
            this.state = drawer.state;
            this.stateChange.emit(this.state);
        }
    }
}
