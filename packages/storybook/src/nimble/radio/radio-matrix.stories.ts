import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@ni/fast-element';
import { radioTag } from '../../../../nimble-components/src/radio';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Tests/Radio',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${radioTag} hidden>Hidden Radio</${radioTag}>`)
);
