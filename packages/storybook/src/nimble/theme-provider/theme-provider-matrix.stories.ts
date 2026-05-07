import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests/Theme Provider',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const scrollbarStates = ['Scrollbar color scheme'] as const;

type ScrollbarState = (typeof scrollbarStates)[number];

const component = (stateLabel: ScrollbarState): ViewTemplate => html`
    <div style="
        display: grid;
        gap: 8px;
        color: var(${bodyFontColor.cssCustomProperty});
        font: var(${bodyFont.cssCustomProperty});
    ">
        <div>${() => stateLabel}</div>
        <div style="
            height: 200px;
            overflow-y: auto;
            border: var(${borderWidth.cssCustomProperty}) solid var(${borderColor.cssCustomProperty});
            padding: 8px;
        ">
            Scroll this content to validate theme-provider color-scheme behavior.
            <br><br>
            The native scrollbar should reflect the current theme panel rendered by matrix mode.
            <br><br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br><br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
    </div>
`;

export const scrollbarColorScheme: StoryFn = createMatrixThemeStory(
    createMatrix(component, [scrollbarStates])
);
