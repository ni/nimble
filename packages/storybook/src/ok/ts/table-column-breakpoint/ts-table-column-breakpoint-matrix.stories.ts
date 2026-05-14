import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { tsTableColumnBreakpointTag } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint';
import { BreakpointState } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint/types';
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
        breakpointState: null
    },
    {
        id: '5',
        breakpointState: undefined
    }
] as const;

const metadata: Meta = {
    title: 'Tests Ok/Ts Table Column: Breakpoint',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 320px">
        <${tsTableColumnBreakpointTag}
            field-name="breakpointState"
        >
            BP
        </${tsTableColumnBreakpointTag}>
    </${tableTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

themeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(tableTag)).map(async table => {
            await table.setData(data);
        })
    );
};
