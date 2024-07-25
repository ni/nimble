import type { StoryObj, Meta } from '@storybook/html';
import { labelProviderRichTextTag } from '@ni/nimble-components/dist/esm/label-provider/rich-text';
import * as labelTokensNamespace from '@ni/nimble-components/dist/esm/label-provider/rich-text/label-tokens';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../base/label-provider-stories-utils';

const metadata: Meta<LabelProviderArgs> = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const richTextLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderRichTextTag,
        labelTokens: Object.entries(labelTokensNamespace),
        prefixSubstring: 'richText'
    }
};
