import { testInsights16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-test-insights-icon': TestInsightsIcon;
    }
}

/**
 * The icon component for the 'test-insights' icon
 */
export class TestInsightsIcon extends Icon {
    public constructor() {
        super(testInsights16X16);
    }
}

registerIcon('test-insights-icon', TestInsightsIcon);
