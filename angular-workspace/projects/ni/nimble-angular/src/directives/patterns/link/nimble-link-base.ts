import { ElementRef, Injectable, Input, Renderer2 } from '@angular/core';
import type { FoundationAnchor } from '@ni/nimble-components/dist/esm/anchor';

/**
 * Base class for directives providing link attributes.
 */
@Injectable()
export class NimbleLinkBase<T extends FoundationAnchor> {
    public get href(): string {
        return this.elementRef.nativeElement.href;
    }

    @Input() public set href(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
    }

    public get hreflang(): string {
        return this.elementRef.nativeElement.hreflang;
    }

    @Input() public set hreflang(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'hreflang', value);
    }

    public get ping(): string {
        return this.elementRef.nativeElement.ping;
    }

    @Input() public set ping(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ping', value);
    }

    public get referrerpolicy(): string {
        return this.elementRef.nativeElement.referrerpolicy;
    }

    @Input() public set referrerpolicy(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'referrerpolicy', value);
    }

    public get rel(): string {
        return this.elementRef.nativeElement.rel;
    }

    @Input() public set rel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rel', value);
    }

    public get target(): string {
        return this.elementRef.nativeElement.target;
    }

    @Input() public set target(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'target', value);
    }

    public get type(): string {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<T>) {}
}