import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { type FvMultiSelect, fvMultiSelectTag } from '@ni/ok-components/dist/esm/fv/multi-select';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitForEvent } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import {
    cartesianProduct,
    createMatrix,
    createMatrixInteractionsFromStates,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Multi Select',
    parameters: { ...sharedMatrixParameters() }
};
export default metadata;

const appearances = Object.values(DropdownAppearance);
const states = ['empty', 'selected', 'clearable', 'disabled', 'open', 'keyboard', 'keyboard-no-search', 'no-results', 'no-search'] as const;

const component = (appearance: DropdownAppearance, state: (typeof states)[number]): ViewTemplate => html`
    <div inert style="display: inline-block; vertical-align: top; width: 340px; height: 360px; padding: 16px;">
        <${fvMultiSelectTag}
            label="${() => `${appearance}: ${state}`}"
            placeholder="Select statuses"
            appearance="${() => appearance}"
            ?filterable="${() => !['no-search', 'keyboard-no-search'].includes(state)}"
            ?clearable="${() => state !== 'selected' && state !== 'no-search'}"
            ?disabled="${() => state === 'disabled'}"
            data-state="${() => state}"
            :options="${() => [
                { value: 'active', label: 'Active' },
                { value: 'ready', label: 'Ready' },
                { value: 'paused', label: 'Paused', disabled: true },
                { value: 'long', label: 'A very long status label that overflows the available dropdown width' }
            ]}"
            :selectedValues="${() => (state === 'empty' ? [] : ['active', 'long'])}"
        ></${fvMultiSelectTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [appearances, states])
);

export const focusThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: [],
        hoverActive: [],
        active: [],
        focus: cartesianProduct([appearances, ['empty', 'clearable', 'disabled']] as const)
    })
);

themeMatrix.play = async ({ canvasElement }): Promise<void> => {
    const elements = canvasElement.querySelectorAll<FvMultiSelect>(fvMultiSelectTag);
    const loaded: Promise<void>[] = [];
    for (const element of elements) {
        if (['open', 'keyboard', 'keyboard-no-search', 'no-results', 'no-search'].includes(element.dataset.state ?? '')) {
            if (!element.region.initialLayoutComplete) {
                loaded.push(waitForEvent(element.region, 'loaded'));
            }
            element.open = true;
        }
    }
    await Promise.all(loaded);
    await waitForUpdatesAsync();
    for (const element of elements) {
        if (element.dataset.state === 'no-results') {
            element.filter = 'missing';
        }
        if (element.dataset.state === 'keyboard' || element.dataset.state === 'keyboard-no-search') {
            element.keyboardNavigation = true;
        }
    }
    await waitForUpdatesAsync();
};
