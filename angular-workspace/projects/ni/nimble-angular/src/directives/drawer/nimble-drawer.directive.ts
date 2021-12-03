import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { Drawer } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation, DrawerState } from '@ni/nimble-components/dist/esm/drawer/types';
import { toBooleanProperty } from '../utilities/template-value-helpers';

export type { Drawer };
export { DrawerLocation, DrawerState };

/**
 * Directive to provide Angular integration for the drawer.
 */
@Directive({
    selector: 'nimble-drawer'
})
export class NimbleDrawerDirective {
    public get location(): DrawerLocation {
        return this.el.nativeElement.location;
    }

    @Input() public set location(value: DrawerLocation) {
        this.renderer.setProperty(this.el.nativeElement, 'location', value);
    }

    public get state(): DrawerState {
        return this.el.nativeElement.state;
    }

    @Input() public set state(value: DrawerState) {
        this.renderer.setProperty(this.el.nativeElement, 'state', value);
    }

    public get modal(): boolean {
        return this.el.nativeElement.modal;
    }

    @Input() public set modal(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'modal', toBooleanProperty(value));
    }

    @Output() public stateChange = new EventEmitter<DrawerState>();

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<Drawer>) {}

    public show(): void {
        this.state = DrawerState.Opening;
    }

    public hide(): void {
        this.state = DrawerState.Closing;
    }

    @HostListener('state-change', ['$event'])
    private onStateChanged($event: Event): void {
        if ($event.target === this.el.nativeElement) {
            this.stateChange.emit(this.state);
        }
    }
}
