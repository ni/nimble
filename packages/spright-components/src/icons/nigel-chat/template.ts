import { html } from '@ni/fast-element';
import type { IconNigelChat } from '.';
import { nigelChatLightData, nigelChatDarkData } from './icon-data';

export const template = html<IconNigelChat>`
    <div class="icon light-icon" aria-hidden="true" :innerHTML="${() => nigelChatLightData}"></div>
    <div class="icon dark-icon" aria-hidden="true" :innerHTML="${() => nigelChatDarkData}"></div>
`;
