import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Mapping } from '@ni/nimble-components/dist/esm/mapping/base';

/**
 * Base class for mapping configuration elements
 */
@Directive()
export class NimbleMappingDirective<T> {
    public get key(): T | undefined {
        return this.elementRef.nativeElement.key;
    }

    @Input() public set key(value: T | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'key', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<Mapping<T>>) {}
}
