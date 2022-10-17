import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import perspective from '@finos/perspective';
import type { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer';
import { styles } from './styles';
import { template } from './template';
import '@finos/perspective-viewer';
import 'regular-table';
import { tableFont } from './table-theme';
import { HTMLPerspectiveViewerDatagridPluginElement } from '../table-perspective-viewer/src/js/custom_elements/datagrid';

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
    private readonly worker = perspective.worker();

    public override connectedCallback(): void {
        super.connectedCallback();
        void (async () => {
            const table = await this.worker.table({
                x: 'float',
                y: 'float'
            });
            await this.viewer.load(table);
            const data = {
                x: [0, 1, 2, 3],
                y: [0, 1, 2, 3]
            };
            table.update(data);
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

customElements.define(
    'perspective-viewer-datagrid',
    HTMLPerspectiveViewerDatagridPluginElement
);

void customElements.whenDefined('perspective-viewer').then(async () => {
    return customElements
        .get('perspective-viewer')
        .registerPlugin('perspective-viewer-datagrid');
});
