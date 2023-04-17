import { html, ref } from '@microsoft/fast-element';
import { notebook16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { keyEnter } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { clickElement } from '../../utilities/tests/component';
import { TreeViewSelectionMode } from '../types';
import { TreeView, treeViewTag } from '..';
import type { TreeItem } from '../../tree-item';
import type { Button } from '../../button';
import '../../tree-item';
import '../../button';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

class Model {
    public treeView!: TreeView;
    public root1!: TreeItem; // starts off expanded
    public root2!: TreeItem;
    public leaf1!: TreeItem;
    public leaf2!: TreeItem; // starts off selected
    public leaf3!: TreeItem;
    public leafWithIconDisabled!: TreeItem;
    public subRoot1!: TreeItem;
    public subRoot2!: TreeItem;
    public button!: Button;
}

async function setup(source: Model): Promise<Fixture<TreeView>> {
    return fixture<TreeView>(
        // prettier-ignore
        html<Model>`
        <nimble-tree-view ${ref('treeView')}>
            <nimble-tree-item ${ref('root1')}>Root1
                <nimble-tree-item ${ref('subRoot1')}>SubRoot
                    <nimble-tree-item ${ref('leaf1')}><nimble-button ${ref('button')}>Leaf1</nimble-button></nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item ${ref('leaf2')} selected>Leaf 2</nimble-tree-item>
                <nimble-tree-item ${ref('leafWithIconDisabled')} disabled><svg slot="start">${notebook16X16.data}</svg>Leaf With Icon</nimble-tree-item>
            </nimble-tree-item>
            <nimble-tree-item ${ref('root2')}>Root2
                <nimble-tree-item ${ref('subRoot2')}>SubRoot 2
                    <nimble-tree-item ${ref('leaf3')}>Leaf 3</nimble-tree-item>
                </nimble-tree-item>
            </nimble-tree-item>
        </nimble-tree-view>`,
        { source }
    );
}

async function pressEnterOnItem(item: TreeItem): Promise<void> {
    const enterKeyEvent = new KeyboardEvent('keydown', {
        key: keyEnter,
        bubbles: true
    } as KeyboardEventInit);
    item.dispatchEvent(enterKeyEvent);
    await waitForUpdatesAsync();
}

describe('TreeView', () => {
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let model: Model;

    beforeEach(async () => {
        model = new Model();
        ({ connect, disconnect } = await setup(model));
        await connect();
        await waitForUpdatesAsync();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(treeViewTag).toBe('nimble-tree-view');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tree-view')).toBeInstanceOf(
            TreeView
        );
    });

    it('should include a role of `tree`', () => {
        expect(model.treeView.getAttribute('role')).toBe('tree');
    });

    it('root1 should have "group-selected" attribute set after initialization', () => {
        expect(model.root1.hasAttribute('group-selected')).toBe(true);
        expect(model.root2.hasAttribute('group-selected')).toBe(false);
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

    it('when leaf item is deselected, root parent tree loses "group-selected" attribute', async () => {
        await clickElement(model.leaf3);
        model.leaf3.selected = false;
        await waitForUpdatesAsync();
        expect(model.root2.hasAttribute('group-selected')).toBe(false);
    });

    it('when second leaf item under same root parent is selected, root parent tree item has "group-selected" attribute', async () => {
        await clickElement(model.leaf1);
        await clickElement(model.leaf2);
        expect(model.root1.hasAttribute('group-selected')).toBe(true);
    });

    it('when selected item is removed, root parent tree loses "group-selected" attribute', async () => {
        expect(model.leaf2.selected).toBeTrue();
        model.leaf2.remove();
        await waitForUpdatesAsync();
        expect(model.root1.hasAttribute('group-selected')).toBeFalse();
    });

    it('when non-selected item is removed, root parent tree keeps "group-selected" attribute', async () => {
        model.leaf1.remove();
        await waitForUpdatesAsync();
        expect(model.root1.hasAttribute('group-selected')).toBeTrue();
    });

    it('when selected item is added to tree, root parent tree gains "group-selected" attribute', async () => {
        expect(model.leaf2.selected).toBeTrue();
        model.leaf2.remove();
        await waitForUpdatesAsync();
        model.root1.appendChild(model.leaf2);
        await waitForUpdatesAsync();
        expect(model.root1.hasAttribute('group-selected')).toBeTrue();
    });

    it('when first leaf is clicked twice, leaf remains selected', async () => {
        await clickElement(model.leaf1);
        await clickElement(model.leaf1);
        expect(model.leaf1.hasAttribute('selected')).toBe(true);
    });

    it('item inside a tree item handles events when clicked', async () => {
        const buttonClicked = jasmine.createSpy();
        model.button.addEventListener('click', buttonClicked);
        await clickElement(model.button);

        expect(buttonClicked.calls.count()).toEqual(1);
    });

    it('item inside a tree item handles events when clicked when item is disabled', async () => {
        const buttonClicked = jasmine.createSpy();
        model.button.disabled = true;
        model.button.addEventListener('click', buttonClicked);
        await clickElement(model.button);

        expect(buttonClicked.calls.count()).toEqual(1);
    });

    it('when disabled tree item is clicked it is not selected', async () => {
        await clickElement(model.leafWithIconDisabled);

        expect(model.leafWithIconDisabled.hasAttribute('selected')).toBe(false);
    });

    it('when glyph is clicked tree group is expanded', async () => {
        const rootExpandButton = model.root1.shadowRoot?.querySelector<HTMLElement>(
            '.expand-collapse-button'
        );

        await clickElement(rootExpandButton!);
        expect(model.root1.hasAttribute('expanded')).toBe(true);
    });

    describe('with `selectionMode` set to `leavesOnly`', () => {
        beforeEach(() => {
            model.treeView.selectionMode = TreeViewSelectionMode.leavesOnly;
        });

        it('when glyph is clicked tree group is expanded', async () => {
            const rootExpandButton = model.root1.shadowRoot?.querySelector<HTMLElement>(
                '.expand-collapse-button'
            );

            await clickElement(rootExpandButton!);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
        });

        it('root1 should not be selected after being clicked, but should be expanded (and fired expanded-change)', async () => {
            const expandedChange = jasmine.createSpy();
            model.treeView.addEventListener('expanded-change', expandedChange);

            await clickElement(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
            expect(expandedChange.calls.count()).toEqual(1);

            await clickElement(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(false);
            expect(expandedChange.calls.count()).toEqual(2);
        });

        it('root1 should not be selected after pressing Enter, but should be expanded (and fired expanded-change)', async () => {
            const expandedChange = jasmine.createSpy();
            model.treeView.addEventListener('expanded-change', expandedChange);

            await pressEnterOnItem(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
            expect(expandedChange.calls.count()).toEqual(1);

            await pressEnterOnItem(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(false);
            expect(expandedChange.calls.count()).toEqual(2);
        });

        it('leaf should be selected by click', async () => {
            await clickElement(model.root1); // expand root1
            await clickElement(model.leaf1);
            expect(model.leaf1.hasAttribute('selected')).toBe(true);
        });

        it('leaf should be selected by pressing Enter', async () => {
            await clickElement(model.root1); // expand root1
            await pressEnterOnItem(model.leaf1);
            expect(model.leaf1.hasAttribute('selected')).toBe(true);
        });

        it('leaf should stay selected after parent is expanded\\collapsed', async () => {
            await clickElement(model.root1); // expand root1
            await clickElement(model.leaf1); // select leaf
            expect(model.leaf1.hasAttribute('selected')).toBe(true);

            await clickElement(model.root1); // collapse root1
            expect(model.leaf1.hasAttribute('selected')).toBe(true);
        });

        it('when disabled group is clicked, it is not expanded', async () => {
            model.root1.disabled = true;
            await clickElement(model.root1);

            expect(model.root1.expanded).toBe(false);
        });
    });

    describe('with `selectionMode` set to `all`', () => {
        beforeEach(() => {
            model.treeView.selectionMode = TreeViewSelectionMode.all;
        });

        it('when glyph is clicked tree group is expanded', async () => {
            const rootExpandButton = model.root1.shadowRoot?.querySelector<HTMLElement>(
                '.expand-collapse-button'
            );

            await clickElement(rootExpandButton!);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
        });

        it('root1 should be selected after being clicked', async () => {
            await clickElement(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(true);
            expect(model.root1.hasAttribute('expanded')).toBe(false);
        });

        it('root1 should be selected after pressing Enter', async () => {
            await pressEnterOnItem(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(true);
            expect(model.root1.hasAttribute('expanded')).toBe(false);
        });

        it('leaf should be selected after being clicked', async () => {
            model.root1.expanded = true;
            await clickElement(model.leaf1);
            expect(model.leaf1.hasAttribute('selected')).toBe(true);
        });

        it('leaf should be selected after pressing Enter', async () => {
            model.root1.expanded = true;
            await pressEnterOnItem(model.leaf1);
            expect(model.leaf1.hasAttribute('selected')).toBe(true);
        });
    });

    describe('with `selectionMode` set to `none`', () => {
        beforeEach(() => {
            model.treeView.selectionMode = TreeViewSelectionMode.none;
        });

        it('when glyph is clicked tree group is expanded', async () => {
            const rootExpandButton = model.root1.shadowRoot?.querySelector<HTMLElement>(
                '.expand-collapse-button'
            );

            await clickElement(rootExpandButton!);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
        });

        it('root1 should not be selected after being clicked, but should be expanded (and fired expanded-change)', async () => {
            const expandedChange = jasmine.createSpy();
            model.treeView.addEventListener('expanded-change', expandedChange);

            await clickElement(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
            expect(expandedChange.calls.count()).toEqual(1);

            await clickElement(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(false);
            expect(expandedChange.calls.count()).toEqual(2);
        });

        it('root1 should not be selected after pressing Enter, but should be expanded (and fired expanded-change)', async () => {
            const expandedChange = jasmine.createSpy();
            model.treeView.addEventListener('expanded-change', expandedChange);

            await pressEnterOnItem(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(true);
            expect(expandedChange.calls.count()).toEqual(1);

            await pressEnterOnItem(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
            expect(model.root1.hasAttribute('expanded')).toBe(false);
            expect(expandedChange.calls.count()).toEqual(2);
        });

        it('when root item is clicked, it is not selected', async () => {
            await clickElement(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
        });

        it('when root item has Enter pressed, it is not selected', async () => {
            await pressEnterOnItem(model.root1);
            expect(model.root1.hasAttribute('selected')).toBe(false);
        });

        it('when leaf item is clicked, it is not selected', async () => {
            await clickElement(model.leaf3);
            expect(model.root1.hasAttribute('selected')).toBe(false);
        });

        it('when leaf item has Enter pressed, it is not selected', async () => {
            await pressEnterOnItem(model.leaf1);
            expect(model.leaf1.hasAttribute('selected')).toBe(false);
        });
    });
});
