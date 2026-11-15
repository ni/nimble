import { html, ref } from '@ni/fast-element';
import type { FvChart } from '.';

export const template = html<FvChart>`
    <div ${ref('chartContainer')} part="chart"></div>
`;
