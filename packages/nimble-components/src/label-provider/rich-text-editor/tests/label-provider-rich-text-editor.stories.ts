import type { StoryObj } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/tests/label-provider-stories-utils';
import { labelProviderRichTextEditorTag } from '..';
import * as labelTokensNamespace from '../label-tokens';
import { removeRichTextEditorPrefixAndCamelCase } from '../name-utils';

const metadata = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const richTextEditorLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderRichTextEditorTag,
        labelTokens: Object.entries(labelTokensNamespace),
        removeNamePrefix: removeRichTextEditorPrefixAndCamelCase
    }
};
