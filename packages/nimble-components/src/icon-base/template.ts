import { html } from '@microsoft/fast-element';
import type { Icon } from '.';

export const template = html<Icon>`${x => x.icon}`;
