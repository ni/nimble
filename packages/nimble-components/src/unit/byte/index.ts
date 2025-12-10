import { attr } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { byte1024UnitScale } from '@ni/unit-format/unit-scale/byte-1024';
import { byteUnitScale } from '@ni/unit-format/unit-scale/byte';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-byte': UnitByte;
    }
}

/**
 * Element that provides a unit scale for conversion of bytes
 */
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

const nimbleUnitByte = UnitByte.compose({
    baseName: 'unit-byte',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitByte());
export const unitByteTag = 'nimble-unit-byte';
