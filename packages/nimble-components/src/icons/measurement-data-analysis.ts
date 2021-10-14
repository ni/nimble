import { measurementDataAnalysis16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'measurement-data-analysis' icon
 */
export class MeasurementDataAnalysisIcon extends Icon {
    public constructor() {
        super(measurementDataAnalysis16X16);
    }
}

registerIcon('measurement-data-analysis-icon', MeasurementDataAnalysisIcon);
