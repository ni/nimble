import { html } from '@ni/fast-element';
import type { ChatConversation } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatConversation>`
<div class="messages"><slot></slot></div>
<div class="input"><slot name="input"></slot></div>`;
/* eslint-enable @typescript-eslint/indent */
