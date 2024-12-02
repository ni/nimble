import { html } from '@microsoft/fast-element';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconBarsTag } from '@ni/nimble-components/dist/esm/icons/bars';
import { iconDownloadTag } from '@ni/nimble-components/dist/esm/icons/download';
import { iconShareNodesTag } from '@ni/nimble-components/dist/esm/icons/share-nodes';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';

import type { ChatWindow } from '.';
import { chatConversationTag } from '../conversation';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatWindow>`
    <${toolbarTag}>
        <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden slot='end'>
            Download
            <${iconDownloadTag} slot='start'></${iconDownloadTag}>
        </${buttonTag}>
        <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden slot='end'>
            Share
            <${iconShareNodesTag} slot='start'></${iconShareNodesTag}>
        </${buttonTag}>
        <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden slot='end'>
            Menu
            <${iconBarsTag} slot='start'></${iconBarsTag}>
        </${buttonTag}>
    </${toolbarTag}>
    <${chatConversationTag}>
        <slot></slot>
    </${chatConversationTag}>
`;
/* eslint-enable @typescript-eslint/indent */
