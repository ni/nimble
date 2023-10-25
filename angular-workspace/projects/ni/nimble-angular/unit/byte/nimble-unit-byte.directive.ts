import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type UnitByte, unitByteTag } from '@ni/nimble-components/dist/esm/unit/byte';
import { toBooleanProperty, type BooleanValueOrAttribute } from '../../internal-utilities/template-value-helpers';

export type { UnitByte };
export { unitByteTag };

/**
 * Directive to provide Angular integration for the byte unit element used by the number-text column.
 */
@Directive({
    selector: 'nimble-unit-byte'
})
export class NimbleUnitByteDirective {
    public get binary(): boolean {
        return this.elementRef.nativeElement.binary;
    }

    @Input() public set binary(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'binary', toBooleanProperty(value));
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<UnitByte>) {}
}