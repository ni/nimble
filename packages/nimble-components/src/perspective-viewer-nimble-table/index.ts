import type { View } from '@finos/perspective';
import type { IPerspectiveViewerPlugin } from '@finos/perspective-viewer';
import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';

import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'perspective-viewer-nimble-table': PerspectiveViewerNimbleTable;
    }
}

/**
 * A nimble-based perspctive plugin for a table
 */
export class PerspectiveViewerNimbleTable extends FoundationElement implements IPerspectiveViewerPlugin {
    public readonly name = 'NimbleTablePlugin';

    @observable
    public content = '';

    public constructor() {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style, @typescript-eslint/naming-convention, camelcase
    public get select_mode(): 'select' | 'toggle' {
        return 'select';
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    public get min_config_columns(): number | undefined {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    public get config_column_names(): string[] | undefined {
        return undefined;
    }

    public async update(view: View): Promise<void> {
        return this.draw(view);
    }

    public async draw(view: View): Promise<void> {
        const csv = await view.to_csv();
        this.content = csv;
    }

    public async clear(): Promise<void> {
        this.content = '';
    }

    public async resize(): Promise<void> {
        // Not Implemented
    }

    public async restyle(): Promise<void> {
        // Not Implemented
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async save(): Promise<any> {
        // Not Implemented
    }

    public async restore(): Promise<void> {
        // Not Implemented
    }

    public async delete(): Promise<void> {
        // Not Implemented
    }
}

const perspectiveViewerNimbleTable = PerspectiveViewerNimbleTable.compose({
    baseName: 'perspective-viewer-nimble-table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(perspectiveViewerNimbleTable());

void (async () => {
    await customElements.whenDefined('perspective-viewer');
    const viewerClass = customElements.get('perspective-viewer');
    const promise = viewerClass.registerPlugin('nimble-perspective-viewer-nimble-table');
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const result = await promise;
    return result;
})();
