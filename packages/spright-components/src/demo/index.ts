import {
    DesignSystem,
    Avatar as FoundationAvatar
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-demo': Demo;
    }
}

/**
 * A Spright demo component (not for production use)
 */
export class Demo extends FoundationAvatar {}

const sprightDemo = Demo.compose({
    baseName: 'demo',
    baseClass: FoundationAvatar,
    // If FAST's template for this component is sufficient, you can just import and use that instead of defining your own.
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightDemo());
export const demoTag = 'spright-demo';
