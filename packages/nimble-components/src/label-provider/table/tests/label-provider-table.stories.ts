import type { StoryObj } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/tests/label-provider-stories-utils';
import { labelProviderTableTag } from '..';
import { removeTablePrefixAndCamelCase } from '../name-utils';
import * as labelTokensNamespace from '../label-tokens';

const metadata = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const tableLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderTableTag,
        labelTokens: Object.entries(labelTokensNamespace),
        removeNamePrefix: removeTablePrefixAndCamelCase
    }
};
