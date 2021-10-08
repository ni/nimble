import { DesignSystem } from '@microsoft/fast-foundation';
import { measurementDataAnalysis16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { MeasurementDataAnalysisIcon };

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
    baseName: 'measurement-data-analysis-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMeasurementDataAnalysisIcon());
