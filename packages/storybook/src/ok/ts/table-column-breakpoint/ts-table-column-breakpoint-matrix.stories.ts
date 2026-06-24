import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { tsTableColumnBreakpointTag } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint';
import { BreakpointState } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint/types';
import { TableColumnPinLocation } from '@ni/nimble-components/dist/esm/table/types';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const data = [
    {
        id: '0',
        breakpointState: BreakpointState.off
    },
    {
        id: '1',
        breakpointState: BreakpointState.enabled
    },
    {
        id: '2',
        breakpointState: BreakpointState.disabled
    },
    {
        id: '3',
        breakpointState: BreakpointState.hit
    },
    {
        id: '4',
        breakpointState: BreakpointState.conditional
    },
    {
        id: '5',
        breakpointState: BreakpointState.hitDisabled
    },
    {
        id: '6',
        breakpointState: null
    },
    {
        id: '7',
        breakpointState: undefined
    }
] as const;

const pinnedStates = [
    ['not pinned', undefined],
    ['pinned', TableColumnPinLocation.left]
] as const;
type PinnedState = (typeof pinnedStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Ts Table Column: Breakpoint',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([pinnedLabel, pinnedValue]: PinnedState): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 320px">
        <${tsTableColumnBreakpointTag}
            field-name="breakpointState"
            pin-location="${() => pinnedValue}"
        >
            BP ${() => `(${pinnedLabel})`}
        </${tsTableColumnBreakpointTag}>
    </${tableTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [pinnedStates])
);

themeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(tableTag)).map(async table => {
            await table.setData(data);
        })
    );
};
