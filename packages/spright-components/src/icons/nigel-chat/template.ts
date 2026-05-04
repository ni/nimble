import { html } from '@ni/fast-element';
import type { IconNigelChat } from '.';
import { nigelChatDarkData } from './icon-data';

// Visual Design is iterating on this icon for NI Connect 2026; it's likely we will get different
// icons for dark and light mode in future but for now they like the dark icon even on light background
export const template = html<IconNigelChat>`
    <div class="icon light-icon" aria-hidden="true" :innerHTML="${() => nigelChatDarkData}"></div>
    <div class="icon dark-icon" aria-hidden="true" :innerHTML="${() => nigelChatDarkData}"></div>
`;
