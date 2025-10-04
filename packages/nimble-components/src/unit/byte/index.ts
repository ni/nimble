import { attr, customElement } from '@ni/fast-element';
import { template } from '../base/template';
import { byte1024UnitScale } from '../../utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { byteUnitScale } from '../../utilities/unit-format/unit-scale/byte-unit-scale';
import { Unit } from '../base/unit';
import { styles } from '../base/styles';

export const unitByteTag = 'nimble-unit-byte';

declare global {
    interface HTMLElementTagNameMap {
        [unitByteTag]: UnitByte;
    }
}

/**
 * Element that provides a unit scale for conversion of bytes
 */
@customElement({
    name: unitByteTag,
    template,
    styles
})
export class UnitByte extends Unit {
    /**
     * Use binary (base 1024 scale with binary prefixes) instead of
     * the default of decimal (base 1000 scale with metric prefixes)
     */
    @attr({ mode: 'boolean' })
    public binary = false;

    public constructor() {
        super();
        this.resolvedUnitScale = byteUnitScale;
    }

    private binaryChanged(): void {
        this.resolvedUnitScale = this.binary
            ? byte1024UnitScale
            : byteUnitScale;
    }
}
