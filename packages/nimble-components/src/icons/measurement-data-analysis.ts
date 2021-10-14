import { measurementDataAnalysis16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

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

registerIcon(baseName, MeasurementDataAnalysisIcon);
