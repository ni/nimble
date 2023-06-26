import type { StoryObj } from '@storybook/html';
import {
    LabelProviderArgs,
    labelProviderMetadata
} from '../../base/label-provider-stories-utils';
import { labelProviderTableTag } from '..';
import { removeTablePrefixAndCamelCase } from '../name-utils';

const metadata = {
    ...labelProviderMetadata,
    title: 'Tokens/Label Providers'
};

export default metadata;

export const tableLabelProvider: StoryObj<LabelProviderArgs> = {
    args: {
        labelProviderTag: labelProviderTableTag,
        removeNamePrefix: removeTablePrefixAndCamelCase
    }
};
