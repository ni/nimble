import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { MenuButton } from '@ni/nimble-components/dist/esm/menu-button';
import type { ButtonAppearance, MenuButtonBeforeToggleEventDetail } from '@ni/nimble-components/dist/esm/menu-button/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { MenuButton };
export type { MenuButtonBeforeToggleEventDetail };

/**
 * Directive to provide Angular integration for the menu button.
 */
@Directive({
    selector: 'nimble-menu-button'
})
export class NimbleMenuButtonDirective {
    public get appearance(): ButtonAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: ButtonAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.contentHidden;
    }

    // contentHidden property intentionally maps to the content-hidden attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('content-hidden') public set contentHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentHidden', toBooleanProperty(value));
    }

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    @Output() public openChange = new EventEmitter<boolean>();

    @Output() public beforeToggle = new EventEmitter<MenuButtonBeforeToggleEventDetail>();

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<MenuButton>) {}

    @HostListener('open-change', ['$event'])
    public onOpenChange($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.openChange.emit(this.open);
        }
    }

    @HostListener('beforetoggle', ['$event'])
    public onBeforeToggle($event: CustomEvent): void {
        this.beforeToggle.emit($event.detail as MenuButtonBeforeToggleEventDetail);
    }
}
