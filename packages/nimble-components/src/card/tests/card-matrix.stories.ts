import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { standardPadding } from '../../theme-provider/design-tokens';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { createMatrixThemeStory } from '../../utilities/tests/storybook';
import { buttonTag } from '../../button';
import { cardTag } from '..';

const metadata: Meta = {
    title: 'Tests/Card',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
<style>
    .body {
        margin-bottom: var(${standardPadding.cssCustomProperty});
    }
</style>
<${cardTag}>
    <div class="body">${loremIpsum}</div>
    <${buttonTag}>Button</${buttonTag}>
</${cardTag}>
`;

export const cardThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);
