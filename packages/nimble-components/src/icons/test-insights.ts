import { testInsights16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { TestInsightsIcon };
export const baseName = 'test-insights-icon';

/**
 * The icon component for the 'test-insights' icon
 */
class TestInsightsIcon extends Icon {
    public constructor() {
        super(testInsights16X16);
    }
}

registerIcon(baseName, TestInsightsIcon);
