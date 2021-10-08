import { DesignSystem } from '@microsoft/fast-foundation';
import { testInsights16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { TestInsightsIcon };

/**
 * The icon component for the 'test-insights' icon
 */
class TestInsightsIcon extends Icon {
    public constructor() {
        super(testInsights16X16);
    }
}

/**
 * A function that returns a nimble-test-insights-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-test-insights-icon\>
 *
 */
const nimbleTestInsightsIcon = TestInsightsIcon.compose({
    baseName: 'test-insights-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTestInsightsIcon());
