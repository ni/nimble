import { DesignSystem } from '@microsoft/fast-foundation';
import { measurementDataAnalysis16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { MeasurementDataAnalysisIcon };
export const baseName = 'measurement-data-analysis-icon';

/**
 * The icon component for the 'measurement-data-analysis' icon
 */
class MeasurementDataAnalysisIcon extends Icon {
    public constructor() {
        super(measurementDataAnalysis16X16);
    }
}

/**
 * A function that returns a nimble-measurement-data-analysis-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-measurement-data-analysis-icon\>
 *
 */
const nimbleMeasurementDataAnalysisIcon = MeasurementDataAnalysisIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleMeasurementDataAnalysisIcon());
