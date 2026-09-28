import { html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html-vite';
import { chatMessageToolSummaryTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary';
import { chatToolCallTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary/tool-call';
import { chatToolCallInputTag } from '@ni/spright-components/dist/esm/chat/message/tool-summary/tool-call-input';
import { ChatToolCallStatus } from '@ni/spright-components/dist/esm/chat/message/tool-summary/types';
import { isChromatic } from '../../../utilities/isChromatic';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Spright/Chat Tool Summary',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const allStatuses = Object.values(ChatToolCallStatus);

export const statusThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; width: 100%; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused;' : ''}">
        ${allStatuses.map(status => html`
            <${chatMessageToolSummaryTag} expanded>
                <${chatToolCallTag} name="systemlink.${status}.tool" status="${status}">
                    <${chatToolCallInputTag} name="status" value="${status}"></${chatToolCallInputTag}>
                </${chatToolCallTag}>
            </${chatMessageToolSummaryTag}>
        `)}
    </div>
`);

export const groupedAndNarrow: StoryFn = createMatrixThemeStory(html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; width: 100%; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused;' : ''}">
        <div style="width: 320px; max-width: 100%;">
            <${chatMessageToolSummaryTag}>
                <${chatToolCallTag} name="systemlink.systems.search_systems_with_an_extremely_long_tool_name" status="pending"></${chatToolCallTag}>
                <${chatToolCallTag} name="systemlink.assets.search_assets" status="success"></${chatToolCallTag}>
            </${chatMessageToolSummaryTag}>
        </div>
        <div style="width: 240px; max-width: 100%;">
            <${chatMessageToolSummaryTag} expanded>
                <${chatToolCallTag} name="systemlink.tags.search_tags" status="error">
                    <${chatToolCallInputTag} name="paths" value='["A very long path that must wrap without changing the layout width","Line2.*"]' value-type="json"></${chatToolCallInputTag}>
                    <${chatToolCallInputTag} value=""></${chatToolCallInputTag}>
                </${chatToolCallTag}>
            </${chatMessageToolSummaryTag}>
        </div>
        <${chatMessageToolSummaryTag}></${chatMessageToolSummaryTag}>
    </div>
`);