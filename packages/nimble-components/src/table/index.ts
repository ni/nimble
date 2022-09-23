import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import perspective from '@finos/perspective';
import type { IPerspectiveViewerElement } from '@finos/perspective-viewer/dist/esm/viewer';
import { styles } from './styles';
import { template } from './template';
import '@finos/perspective-viewer';
import '@finos/perspective-viewer-datagrid';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

/**
 * A nimble-styled container for toolbar content next to tabs.
 */
export class Table extends FoundationElement {
    public readonly viewer!: IPerspectiveViewerElement;
    private readonly worker = perspective.worker();

    public override connectedCallback(): void {
        super.connectedCallback();
        void (async () => {
            const table = await this.worker.table({
                x: 'float',
                y: 'float'
            });
            await this.viewer.load(table);
            table.update([
                {
                    // @ts-expect-error sfd
                    x: 0,
                    // @ts-expect-error sfd
                    y: 0
                }
            ]);
        })();
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
