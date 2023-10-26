import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import type { UnitScaleFormatterConstructor } from '../../table-column/number-text/models/unit-scale-formatter';
import { Byte1024UnitScaleFormatter } from './models/byte-1024-unit-scale-formatter';
import { ByteUnitScaleFormatter } from './models/byte-unit-scale-formatter';
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

    public override getFormatter(): UnitScaleFormatterConstructor {
        return this.binary
            ? Byte1024UnitScaleFormatter
            : ByteUnitScaleFormatter;
    }
}

const nimbleUnitByte = UnitByte.compose({
    baseName: 'unit-byte',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitByte());
export const unitByteTag = DesignSystem.tagFor(UnitByte);
