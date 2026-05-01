import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, when, type ViewTemplate } from '@ni/fast-element';
import { fvCardTag } from '@ni/ok-components/dist/esm/fv/card';
import { FvCardInteractionMode } from '@ni/ok-components/dist/esm/fv/card/types';
import { iconSystemlinkTag } from '@ni/nimble-components/dist/esm/icons/systemlink';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';
import { hiddenWrapper } from '../../../utilities/hidden';
import { createStory } from '../../../utilities/storybook';

const interactionStates = [
    ['Static', FvCardInteractionMode.static],
    ['Card', FvCardInteractionMode.card]
] as const;
type InteractionState = (typeof interactionStates)[number];

const mediaStates = [
    ['Initials', 'initials'],
    ['Icon', 'icon']
] as const;
type MediaState = (typeof mediaStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Fv Card',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [interactionName, interactionMode]: InteractionState,
    [mediaName, mediaType]: MediaState
): ViewTemplate => html`
    <div style="width: 320px; margin-right: 8px; margin-bottom: 8px;">
        <${fvCardTag}
            card-title="${() => `${interactionName} ${mediaName}` }"
            subtitle="Storybook matrix"
            description="Verifies the card shell and media region combinations."
            interaction-mode="${() => interactionMode}"
            initials="${() => mediaType === 'initials' ? 'FC' : ''}"
        >
            ${when(
                () => mediaType === 'icon',
                html`<${iconSystemlinkTag} slot="icon"></${iconSystemlinkTag}>`
            )}
            <span slot="footer-start">Meta</span>
            <span slot="footer-end">v1.0.0</span>
        </${fvCardTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [interactionStates, mediaStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${fvCardTag} hidden card-title="Hidden Card"></${fvCardTag}>`
    )
);
