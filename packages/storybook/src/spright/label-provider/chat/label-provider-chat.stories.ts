import type { StoryObj, Meta } from '@storybook/html-vite';
import { labelProviderChatTag } from '@ni/spright-components/dist/esm/label-provider/chat';
import * as labelTokensNamespace from '@ni/spright-components/dist/esm/label-provider/chat/label-tokens';
import {
    type LabelProviderArgs,
    labelProviderMetadata
} from '../../../utilities/label-provider/label-provider-stories-utils';

const metadata: Meta<LabelProviderArgs> = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const chatLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderChatTag,
        labelTokens: Object.entries(labelTokensNamespace),
        prefixSubstring: 'chat'
    }
};