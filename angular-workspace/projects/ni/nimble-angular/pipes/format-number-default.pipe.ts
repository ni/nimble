import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DefaultUnitFormat } from '@ni/nimble-components/dist/esm/utilities/unit-format/default-unit-format';
import { passthroughUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/passthrough-unit-scale';
import { byteUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-unit-scale';
import { byte1024UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { voltUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/volt-unit-scale';
import type { UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/unit-scale';

export { byteUnitScale, byte1024UnitScale, voltUnitScale };

/**
 * A pipe that transforms a number into a string with optional unit"
 */
@Pipe({
    name: 'formatNumberDefault',
    standalone: true
})
export class FormatNumberDefaultPipe implements PipeTransform {
    /**
     * @internal
     */
    public defaultUnitFormat?: DefaultUnitFormat;
    private unitScale?: UnitScale;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: number, unitScale: UnitScale = passthroughUnitScale): string {
        if (!this.defaultUnitFormat
            || this.unitScale !== unitScale) {
            this.unitScale = unitScale;
            this.defaultUnitFormat = new DefaultUnitFormat(this.locale, {
                unitScale: this.unitScale
            });
        }
        return this.defaultUnitFormat.format(value);
    }
}
