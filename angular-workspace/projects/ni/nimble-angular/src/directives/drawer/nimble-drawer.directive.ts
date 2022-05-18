import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { Drawer } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation, DrawerState } from '@ni/nimble-components/dist/esm/drawer/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

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
        return this.elementRef.nativeElement.location;
    }

    @Input() public set location(value: DrawerLocation) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'location', value);
    }

    public get state(): DrawerState {
        return this.elementRef.nativeElement.state;
    }

    @Input() public set state(value: DrawerState) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'state', value);
    }

    public get modal(): boolean {
        return this.elementRef.nativeElement.modal;
    }

    @Input() public set modal(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'modal', toBooleanProperty(value));
    }

    public get preventDismiss(): boolean {
        return this.elementRef.nativeElement.preventDismiss;
    }

    // preventDismiss property intentionally maps to the prevent-dismiss attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('prevent-dismiss') public set preventDismiss(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'preventDismiss', toBooleanProperty(value));
    }

    @Output() public stateChange = new EventEmitter<DrawerState>();
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Drawer>) {}

    public show(): void {
        this.state = DrawerState.opening;
    }

    public hide(): void {
        this.state = DrawerState.closing;
    }

    @HostListener('state-change', ['$event'])
    public onStateChanged($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.stateChange.emit(this.state);
        }
    }
}
