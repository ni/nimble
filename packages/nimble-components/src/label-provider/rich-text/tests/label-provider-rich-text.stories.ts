import type { StoryObj } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/tests/label-provider-stories-utils';
import { labelProviderRichTextTag } from '..';
import * as labelTokensNamespace from '../label-tokens';
import { removePrefixAndCamelCase } from '../../base/tests/label-name-utils';

const metadata = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const richTextLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderRichTextTag,
        labelTokens: Object.entries(labelTokensNamespace),
        prefixSubstring: 'richText',
        removeNamePrefix: removePrefixAndCamelCase
    }
};
