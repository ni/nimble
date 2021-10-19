import {
    DesignSystem,
    Tab,
    tabTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { Tab };

export const nimbleTab = Tab.compose({
    baseName: 'tab',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTab());
