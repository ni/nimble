import { html } from '@microsoft/fast-element';
import type { ChatMessage } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatMessage>`<div><slot></slot></div>`;
/* eslint-enable @typescript-eslint/indent */
