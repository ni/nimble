import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { byte1024UnitScale } from '../../utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { byteUnitScale } from '../../utilities/unit-format/unit-scale/byte-unit-scale';
import { Unit } from '../base/unit';

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
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitByte());
export const unitByteTag = 'nimble-unit-byte';
