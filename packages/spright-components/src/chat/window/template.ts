import { html } from '@microsoft/fast-element';
import type { ChatWindow } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatWindow>`
    <slot></slot>
`;
/* eslint-enable @typescript-eslint/indent */
