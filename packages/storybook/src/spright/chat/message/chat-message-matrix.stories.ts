import type { StoryFn, Meta } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import {
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';
import { textCustomizationWrapper } from '../../../utilities/text-customization';

const metadata: Meta = {
    title: 'Tests Spright/Chat Message',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageTag}>Message</${chatMessageTag}>`
    )
);
