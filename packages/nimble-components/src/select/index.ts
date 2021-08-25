import type { ViewTemplate } from '@microsoft/fast-element';
import {
    DesignSystem,
    ElementDefinitionContext,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { downArrow16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

import { styles } from './styles';

const templateWithLabel = (context: ElementDefinitionContext, definition: SelectOptions): ViewTemplate<FoundationSelect> => {
    const baseTemplate = template(context, definition);
    return baseTemplate;
};

const nimbleSelect = FoundationSelect.compose<SelectOptions>({
    baseName: 'select',
    template: templateWithLabel,
    styles,
    indicator: downArrow16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
