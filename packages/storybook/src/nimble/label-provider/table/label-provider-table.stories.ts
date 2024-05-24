import type { StoryObj, Meta } from '@storybook/html';
import { labelProviderTableTag } from '../../../../../nimble-components/src/label-provider/table';
import * as labelTokensNamespace from '../../../../../nimble-components/src/label-provider/table/label-tokens';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../base/label-provider-stories-utils';

const metadata: Meta<LabelProviderArgs> = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const tableLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderTableTag,
        labelTokens: Object.entries(labelTokensNamespace),
        prefixSubstring: 'table'
    }
};
