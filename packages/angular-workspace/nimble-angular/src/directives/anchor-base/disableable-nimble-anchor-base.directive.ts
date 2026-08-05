import { Directive, type DoCheck, ElementRef, Input, Optional, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { AnchorBase } from '@ni/nimble-components/dist/esm/anchor-base';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleAnchorBaseDirective } from './nimble-anchor-base.directive';

/**
 * Base class for directives providing link attributes that include 'disabled'.
 * @internal
 */
@Directive()
export class DisableableNimbleAnchorBaseDirective<T extends (AnchorBase & { disabled: boolean })>
    extends NimbleAnchorBaseDirective<T>
    implements DoCheck {
    private readonly disabledRouterLinkTarget = '_disabled';

    public constructor(renderer: Renderer2, elementRef: ElementRef<T>, @Optional() private readonly routerLink?: RouterLink) {
        super(renderer, elementRef);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        const isDisabled = toBooleanProperty(value);
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    // RouterLink handles clicks on anchor-like custom elements, even when they are disabled. To prevent this,
    // we take advantage of the fact that it only handles navigating within the current window (i.e. 'target' is '_self' or not set).
    // After every change detection pass, we ensure that the RouterLink's 'target' property is something other than '_self' while
    // the element is disabled.
    public ngDoCheck(): void {
        this.updateRouterLinkTarget(this.disabled);
    }

    private updateRouterLinkTarget(disabled: boolean): void {
        if (this.routerLink) {
            if (disabled && (this.routerLink.target === '_self' || this.routerLink.target === undefined)) {
                this.routerLink.target = this.disabledRouterLinkTarget;
            } else if (!disabled && this.routerLink.target === this.disabledRouterLinkTarget) {
                this.routerLink.target = undefined;
            }
        }
    }
}