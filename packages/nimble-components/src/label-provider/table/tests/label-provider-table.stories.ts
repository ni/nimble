import type { StoryObj } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/tests/label-provider-stories-utils';
import { labelProviderTableTag } from '..';
import * as labelTokensNamespace from '../label-tokens';
import { removePrefixAndCamelCase } from '../../base/tests/label-name-utils';

const metadata = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const tableLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderTableTag,
        labelTokens: Object.entries(labelTokensNamespace),
        prefixSubstring: 'table',
        removeNamePrefix: removePrefixAndCamelCase
    }
};
