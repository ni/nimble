import type { StoryObj, Meta } from '@storybook/html';
import { labelProviderCoreTag } from '../../../../../nimble-components/src/label-provider/core';
import * as labelTokensNamespace from '../../../../../nimble-components/src/label-provider/core/label-tokens';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../base/label-provider-stories-utils';

const metadata: Meta<LabelProviderArgs> = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const coreLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderCoreTag,
        labelTokens: Object.entries(labelTokensNamespace)
    }
};
