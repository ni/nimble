import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Drawer, UserDismissed } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation } from '@ni/nimble-components/dist/esm/drawer/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Drawer };
export { DrawerLocation };

/**
 * Directive to provide Angular integration for the drawer element.
 * @description
 * In order to provide a custom value for the `CloseReason` for the drawer you need to obtain
 * a `@ViewChild` reference with the custom type specified. For example, to specify the type as `string`:
 * ```ts
 * @ViewChild('drawer', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective<string>;
 * ```
 */
@Directive({
    selector: 'nimble-drawer'
})
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class NimbleDrawerDirective<CloseReason = void> {
    public get location(): DrawerLocation {
        return this.elementRef.nativeElement.location;
    }

    @Input() public set location(value: DrawerLocation) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'location', value);
    }

    public get preventDismiss(): boolean {
        return this.elementRef.nativeElement.preventDismiss;
    }

    // preventDismiss property intentionally maps to the prevent-dismiss attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('prevent-dismiss') public set preventDismiss(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'preventDismiss', toBooleanProperty(value));
    }

    public get ariaLabel(): string | null {
        return this.elementRef.nativeElement.ariaLabel;
    }

    // ariaLabel property intentionally maps to the aria-label attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('aria-label') public set ariaLabel(value: string | null) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
    }

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Drawer<CloseReason>>) {}

    public async show(): Promise<CloseReason | UserDismissed> {
        return this.elementRef.nativeElement.show();
    }

    public close(reason: CloseReason): void {
        this.elementRef.nativeElement.close(reason);
    }
}
