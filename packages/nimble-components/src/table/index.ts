import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import perspective from '@finos/perspective';
import type { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer';
import { styles } from './styles';
import { template } from './template';
import '@finos/perspective-viewer';
import 'regular-table';
import { tableFont } from './table-theme';
import { HTMLPerspectiveViewerDatagridPluginElement } from '../perspective-viewer-datagrid/src/js/custom_elements/datagrid';
import '../perspective-viewer-nimble-table';
import { Table as PerspectiveTable } from '@finos/perspective';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

// Install the google font
document.head.insertAdjacentHTML(
    'beforeend',
    `
<style>
    ${tableFont}
</style>
`
);

/**
 * A nimble-styled container for toolbar content next to tabs.
 */
export class Table extends FoundationElement {
    public readonly viewer!: HTMLPerspectiveViewerElement;
    public table: PerspectiveTable | undefined = undefined;
    private readonly worker = perspective.worker();

    public override connectedCallback(): void {
        super.connectedCallback();
        void (async () => {
            this.table = await this.worker.table({
                x: 'string',
                y: 'string',
                id: 'string',
                age: 'float',
                parentId: 'string'
            });
            await this.viewer.load(this.table);
            const data = {
                x: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                y: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                age: [12, 6, 3, 3, 3, 7, 7, 7, 7, 7],
                id: ['id-0', 'id-1', 'id-2', 'id-3', 'id-4', 'id-5', 'id-6', 'id-7', 'id-8', 'id-9'],
                parentId: ['', 'id-3', 'id-1', '', 'id-3', 'id-3', 'id-9', 'id-0', '', '']
            };
            this.table.update(data);
            await this.viewer.toggleConfig(true);
            // theme needs to be manually reset as the autodetection
            // of styles won't work
            await this.viewer.resetThemes(['Material Light']);
        })();
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());

// Inlined registration from perspective-viewer-datagrid\src\js\index.js
customElements.define(
    'perspective-viewer-datagrid',
    HTMLPerspectiveViewerDatagridPluginElement
);

void customElements.whenDefined('perspective-viewer').then(async () => {
    return customElements
        .get('perspective-viewer')
        .registerPlugin('perspective-viewer-datagrid');
});
