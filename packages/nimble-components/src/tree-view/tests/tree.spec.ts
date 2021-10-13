import { DOM, html, ref } from '@microsoft/fast-element';
import type { TreeView, TreeItem } from '@microsoft/fast-foundation';
import { notebook16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { fixture, Fixture } from '../../tests/utilities/fixture';
import { clickElement } from '../../tests/utilities/component-test-helpers';
import '..';
import '../../tree-item';

class Model {
    public root1: TreeItem;
    public root2: TreeItem;
    public leaf1: TreeItem;
    public leaf2: TreeItem; // starts off selected
    public leaf3: TreeItem;
    public leafWithIcon: TreeItem;
    public subRoot1: TreeItem;
    public subRoot2: TreeItem;
}

async function setup(source: Model): Promise<Fixture<TreeView>> {
    return fixture<TreeView>(
        // prettier-ignore
        html<Model>`
        <nimble-tree-view>
            <nimble-tree-item ${ref('root1')}>Root1
                <nimble-tree-item ${ref('subRoot1')}>SubRoot
                    <nimble-tree-item ${ref('leaf1')}>Leaf 1</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item ${ref('leaf2')} selected>Leaf 2</nimble-tree-item>
                <nimble-tree-item ${ref('leafWithIcon')}><svg slot="start">${notebook16X16.data}</svg>Leaf 1</nimble-tree-item>
            </nimble-tree-item>
            <nimble-tree-item ${ref('root2')}>Root2
                <nimble-tree-item ${ref('subRoot2')}>SubRoot 2
                    <nimble-tree-item ${ref('leaf3')}>Leaf 1</nimble-tree-item>
                </nimble-tree-item>
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

    it('root1 should have "group-selected" attribute set after initialization', async () => {
        expect(model.root1.hasAttribute('group-selected')).toBe(true);
        expect(model.root2.hasAttribute('group-selected')).toBe(false);
    });

    it('root1 should not be selected after being clicked, but should be expanded (and fired expanded-change)', async () => {
        const expandedChange = jasmine.createSpy();
        model.root1.addEventListener('expanded-change', expandedChange);

        await clickElement(model.root1);
        expect(model.root1.hasAttribute('selected')).toBe(false);
        expect(model.root1.hasAttribute('expanded')).toBe(true);
        expect(expandedChange.calls.count()).toEqual(1);

        await clickElement(model.root1);
        expect(model.root1.hasAttribute('selected')).toBe(false);
        expect(model.root1.hasAttribute('expanded')).toBe(false);
        expect(expandedChange.calls.count()).toEqual(2);
    });

    it('leaf should stay selected after parent is expanded\\collapsed', async () => {
        await clickElement(model.root1); // expand root1
        await clickElement(model.leaf1); // select leaf
        expect(model.leaf1.hasAttribute('selected')).toBe(true);

        await clickElement(model.root1); // collapse root1
        expect(model.leaf1.hasAttribute('selected')).toBe(true);
    });

    it('when group is clicked, the TreeView currentSelected state does not change', async () => {
        await clickElement(model.leaf1); // select leaf
        await clickElement(model.root1); // collapse root1
        expect(element.currentSelected).toBe(model.leaf1);
    });

    it('when leaf item is selected, only root parent tree item has "group-selected" attribute', async () => {
        await clickElement(model.leaf3);
        expect(model.root2.hasAttribute('group-selected')).toBe(true);
        expect(model.subRoot2.hasAttribute('group-selected')).toBe(false);
        expect(model.root1.hasAttribute('group-selected')).toBe(false);
        expect(model.leaf3.hasAttribute('group-selected')).toBe(false);

        await clickElement(model.leaf1);
        expect(model.root2.hasAttribute('group-selected')).toBe(false);
        expect(model.subRoot2.hasAttribute('group-selected')).toBe(false);
        expect(model.root1.hasAttribute('group-selected')).toBe(true);
        expect(model.leaf3.hasAttribute('group-selected')).toBe(false);
    });

    it('when first leaf is clicked twice, leaf remains selected', async () => {
        await clickElement(model.leaf1);
        await clickElement(model.leaf1);
        expect(model.leaf1.hasAttribute('selected')).toBe(true);
    });

    it('when glyph is clicked tree group is expanded', async () => {
        const rootExpandButton = model.root1.shadowRoot?.querySelector<HTMLElement>(
            '.expand-collapse-button'
        );

        await clickElement(rootExpandButton!);
        expect(model.root1.hasAttribute('expanded')).toBe(true);
    });
});
