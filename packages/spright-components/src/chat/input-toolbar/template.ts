import { html, ref } from '@microsoft/fast-element';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconLightbulbTag } from '@ni/nimble-components/dist/esm/icons/lightbulb';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { TextFieldAppearance } from '@ni/nimble-components/dist/esm/text-field/types';
// import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
// import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';

import type { ChatInputToolbar } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatInputToolbar>`
    <ni-nimble-theme-provider theme='color'>
        <${toolbarTag}>
            <slot name="start"></slot>
            <${textFieldTag}
                placeholder='How can I assist you today?'
                appearance=${TextFieldAppearance.block}
                @keyup="${(x, c) => x.onTextFieldKeyUp(c.event as KeyboardEvent)}"
                ${ref('textField')}
            >
                <${buttonTag}
                    appearance='${ButtonAppearance.ghost}'
                    content-hidden
                    slot='start'
                >
                    Prompt
                    <${iconLightbulbTag} slot='start'></${iconLightbulbTag}>
                </${buttonTag}>
                <${buttonTag}
                    appearance='${ButtonAppearance.ghost}'
                    content-hidden
                    slot='actions'
                    @click="${x => x.submitMessage()}"
                >
                    Submit
                    <${iconPaperPlaneTag} slot='start'></${iconPaperPlaneTag}>
                </${buttonTag}>
            </${textFieldTag}>
            <slot name="end"></slot>
        </${toolbarTag}>
    </ni-nimble-theme-provider>
`;
/* eslint-enable @typescript-eslint/indent */
