import { html } from '@ni/fast-element';
import type { TsIconDynamic } from '.';

export const template = html<TsIconDynamic>`<img aria-hidden="true" src=${x => x.url}>`;
