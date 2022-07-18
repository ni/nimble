import { DomPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, ApplicationRef, ComponentFactoryResolver, Directive, ElementRef, Injector } from '@angular/core';
import type { Dialog } from '@ni/nimble-components/dist/esm/dialog';

export type { Dialog };

/**
 * Directive to provide Angular integration for the dialog element.
 */
@Directive({
    selector: 'nimble-dialog'
})
export class NimbleDialogDirective implements AfterViewInit {
    private host: DomPortalOutlet;

    public constructor(
        private readonly el: ElementRef,
        private readonly cfr: ComponentFactoryResolver,
        private readonly appRef: ApplicationRef,
        private readonly injector: Injector
    ) {}

    public ngAfterViewInit(): void {
        this.host = new DomPortalOutlet(
            this.el.nativeElement as Element,
            this.cfr,
            this.appRef,
            this.injector
        );
    }
}