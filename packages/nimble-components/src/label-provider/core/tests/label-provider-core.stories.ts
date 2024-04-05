import type { StoryObj, Meta } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/tests/label-provider-stories-utils';
import { labelProviderCoreTag } from '..';
import * as labelTokensNamespace from '../label-tokens';

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
