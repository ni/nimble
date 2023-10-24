import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import type { UnitScaleFormatterConstructor } from '../../table-column/number-text/models/unit-scale-formatter';
import { Byte1024ScaleFormatter } from '../../table-column/number-text/models/byte-1024-scale-formatter';
import { ByteScaleFormatter } from '../../table-column/number-text/models/byte-scale-formatter';
import { UnitScale } from '../base/unit-scale';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-byte': UnitByte;
    }
}

/**
 * Element representing units for bytes
 */
export class UnitByte extends UnitScale {
    // If true, 1024-based units are used instead of 1000-based units
    @attr({ mode: 'boolean' })
    public binary = false;

    public override getFormatter(): UnitScaleFormatterConstructor {
        return this.binary ? Byte1024ScaleFormatter : ByteScaleFormatter;
    }
}

const nimbleUnitByte = UnitByte.compose({
    baseName: 'unit-byte',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitByte());
export const unitByteTag = DesignSystem.tagFor(UnitByte);
