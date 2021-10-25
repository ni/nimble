import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
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

    public constructor(private readonly drawerReference: ElementRef<Drawer>) {
    }

    public show(): void {
        this.drawerReference.nativeElement.show();
    }

    public hide(): void {
        this.drawerReference.nativeElement.hide();
    }
}
