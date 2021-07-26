import { html } from '@microsoft/fast-element';
import type { Image } from './index';

export const template = html<Image>`
    <img src="${(x: Image): string => x.source}">
`;
