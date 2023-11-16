import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import type { UnitScale } from '../../table-column/number-text/models/unit-scale';
import { Byte1024UnitScale } from './models/byte-1024-unit-scale';
import { ByteUnitScale } from './models/byte-unit-scale';
import { Unit } from '../base/unit';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-byte': UnitByte;
    }
}

/**
 * Element representing units for bytes
 */
export class UnitByte extends Unit {
    // If true, 1024-based units are used instead of 1000-based units
    @attr({ mode: 'boolean' })
    public binary = false;

    public override getUnitScale(): UnitScale {
        return this.binary
            ? Byte1024UnitScale.instance
            : ByteUnitScale.instance;
    }
}

const nimbleUnitByte = UnitByte.compose({
    baseName: 'unit-byte',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitByte());
export const unitByteTag = DesignSystem.tagFor(UnitByte);
