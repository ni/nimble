import type { StoryObj } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/label-provider-stories-utils';
import { labelProviderCoreTag } from '..';

const metadata = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers',
    tags: ['autodocs']
};

export default metadata;

export const coreLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderCoreTag
    }
};
