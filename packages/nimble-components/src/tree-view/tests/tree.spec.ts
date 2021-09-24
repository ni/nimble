import { DOM, html, ref } from '@microsoft/fast-element';
import type { TreeView, TreeItem } from '@microsoft/fast-foundation';
import { notebook16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { fixture, Fixture } from '../../tests/utilities/fixture';
import { clickElement } from '../../tests/utilities/component-test-helpers';
import '..';
import '../../tree-item';

class Model {
    public root: TreeItem;
    public leaf1: TreeItem;
    public leaf2: TreeItem;
    public leafWithIcon: TreeItem;
}

async function setup(source: Model): Promise<Fixture<TreeView>> {
    return fixture<TreeView>(
        // prettier-ignore
        html<Model>`
        <nimble-tree-view>
            <nimble-tree-item ${ref('root')}>Root1
                <nimble-tree-item>SubRoot
                    <nimble-tree-item ${ref('leaf1')}>Leaf 1</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item ${ref('leaf2')}>Leaf 2</nimble-tree-item>
                <nimble-tree-item ${ref('leafWithIcon')}><svg slot="start">${notebook16X16.data}</svg>Leaf 1</nimble-tree-item>
            </nimble-tree-item>
        </nimble-tree-view>`,
        { source }
    );
}

describe('TreeView', () => {
    let element: TreeView;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let model: Model;

    beforeEach(async () => {
        model = new Model();
        ({ element, connect, disconnect } = await setup(model));
        await connect();
        await DOM.nextUpdate();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('root should not be selected after bring clicked, but should be expanded', async () => {
        await clickElement(model.root);
        expect(model.root.hasAttribute('selected')).toBe(false);
        expect(model.root.hasAttribute('expanded')).toBe(true);

        await clickElement(model.root);
        expect(model.root.hasAttribute('selected')).toBe(false);
        expect(model.root.hasAttribute('expanded')).toBe(false);
    });

    it('leaf should stay selected after parent is expanded\\collapsed', async () => {
        await clickElement(model.root); // expand root
        await clickElement(model.leaf2); // select leaf
        expect(model.leaf2.hasAttribute('selected')).toBe(true);

        await clickElement(model.root); // collapse root
        expect(model.leaf2.hasAttribute('selected')).toBe(true);
    });

    it('when group is clicked, the TreeView currentSelected state does not change', async () => {
        await clickElement(model.leaf2); // select leaf
        await clickElement(model.root); // collapse root
        expect(element.currentSelected).toBe(model.leaf2);
    });

    it('when glyph is clicked tree group is expanded', async () => {
        const rootExpandButton = model.root.shadowRoot?.querySelector<HTMLElement>(
            '.expand-collapse-button'
        );

        await clickElement(rootExpandButton!);
        expect(model.root.hasAttribute('expanded')).toBe(true);
    });
});
