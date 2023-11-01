import { html } from '@microsoft/fast-element';
import type { Card } from '.';

export const template = html<Card>`<slot></slot>`;
