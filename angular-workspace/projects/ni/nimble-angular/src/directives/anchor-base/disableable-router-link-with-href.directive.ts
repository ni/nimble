import { Directive, type ElementRef, type Injector } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';

/**
 * Base class for Nimble router link directives that go on disableable elements
 */
@Directive()
export class DisableableRouterLinkWithHrefDirective<T extends { disabled: boolean }> extends RouterLinkWithHref {
    public constructor(injector: Injector, private readonly elementRef: ElementRef<T>) {
        super(injector.get(Router), injector.get(ActivatedRoute), injector.get(LocationStrategy));
    }

    public override onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean): boolean {
        if (this.elementRef.nativeElement.disabled) {
            return false;
        }

        return super.onClick(button, ctrlKey, shiftKey, altKey, metaKey);
    }
}
