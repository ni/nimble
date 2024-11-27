import { html } from '@microsoft/fast-element';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconAddTag } from '@ni/nimble-components/dist/esm/icons/add';
import { iconBarsTag } from '@ni/nimble-components/dist/esm/icons/bars';
import { iconDownloadTag } from '@ni/nimble-components/dist/esm/icons/download';
import { iconLightbulbTag } from '@ni/nimble-components/dist/esm/icons/lightbulb';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { iconPaperclipTag } from '@ni/nimble-components/dist/esm/icons/paperclip';
import { iconShareNodesTag } from '@ni/nimble-components/dist/esm/icons/share-nodes';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { TextFieldAppearance } from '@ni/nimble-components/dist/esm/text-field/types';
import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
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
    <${themeProviderTag} theme='${Theme.color}'>
        <${toolbarTag}>
            <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden>
                Add chat
                <${iconAddTag} slot='start'></${iconAddTag}>
            </${buttonTag}>
            <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden>
                Text prompt
                <${iconLightbulbTag} slot='start'></${iconLightbulbTag}>
            </${buttonTag}>
            <${textFieldTag}
                placeholder='How can I assist you today?'
                appearance=${TextFieldAppearance.block}
            >
                <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden slot='actions'>
                    Submit
                    <${iconPaperPlaneTag} slot='start'></${iconPaperPlaneTag}>
                </${buttonTag}>
            </${textFieldTag}>
            <${buttonTag} appearance='${ButtonAppearance.ghost}' content-hidden>
                Attach
                <${iconPaperclipTag} slot='start'></${iconPaperclipTag}>
            </${buttonTag}>
        </${toolbarTag}>
    </${themeProviderTag}>
`;
/* eslint-enable @typescript-eslint/indent */
