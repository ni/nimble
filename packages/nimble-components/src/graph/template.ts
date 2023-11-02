import { html, ref } from '@microsoft/fast-element';
import type { Graph } from '.';

export const template = html<Graph>`
    <div class="graph-container" ${ref('graphContainer')}></div>
`;
