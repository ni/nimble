import { html } from '@ni/fast-element';
import type { IconDynamic } from '.';

export const template = html<IconDynamic>`<img aria-hidden="true" src=${x => x.url}>`;
