import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Drawer, type UserDismissed, drawerTag } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation } from '@ni/nimble-components/dist/esm/drawer/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Drawer };
export { drawerTag };
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

    @Input('prevent-dismiss') public set preventDismiss(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'preventDismiss', toBooleanProperty(value));
    }

    public get ariaLabel(): string | null {
        return this.elementRef.nativeElement.ariaLabel;
    }

    @Input('aria-label') public set ariaLabel(value: string | null) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
    }

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Drawer<CloseReason>>) {}

    public async show(): Promise<CloseReason | UserDismissed> {
        return await this.elementRef.nativeElement.show();
    }

    public close(reason: CloseReason): void {
        this.elementRef.nativeElement.close(reason);
    }
}
