/* eslint-disable max-classes-per-file */
import { customElement, html, ref } from '@microsoft/fast-element';
import { TreeItem as FoundationTreeItem } from '@microsoft/fast-foundation';
import { AnchorTreeItem } from '..';
import type { IconCheck } from '../../icons/check';
import type { IconXmark } from '../../icons/xmark';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { TreeItem } from '../../tree-item';
import type { TreeView } from '../../tree-view';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

@customElement('foundation-tree-item')
export class TestTreeItem extends FoundationTreeItem {}

describe('Anchor Tree Item', () => {
    describe('standalone', () => {
        class Model {
            public xmarkIcon!: IconXmark;
            public checkIcon!: IconCheck;
        }

        async function setup(source: Model): Promise<Fixture<AnchorTreeItem>> {
            return fixture<AnchorTreeItem>(
                html`<nimble-anchor-tree-item href="#">
                    <nimble-xmark-icon
                        ${ref('xmarkIcon')}
                        slot="start"
                    ></nimble-xmark-icon>
                    <nimble-check-icon
                        ${ref('checkIcon')}
                        slot="end"
                    ></nimble-check-icon>
                </nimble-anchor-tree-item>`,
                { source }
            );
        }

        let model: Model;
        let element: AnchorTreeItem;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            model = new Model();
            ({ element, connect, disconnect } = await setup(model));
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(
                document.createElement('nimble-anchor-tree-item')
            ).toBeInstanceOf(AnchorTreeItem);
        });

        it('should set the role to treeitem', async () => {
            await connect();
            expect(element.getAttribute('role')).toBe('treeitem');
        });

        it('should set aria-disabled when disabled is set', async () => {
            await connect();
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(element.ariaDisabled).toBe('true');
        });

        it('should clear control href when disabled is set', async () => {
            await connect();
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(element.control.href).toBe('');
        });

        const attributeNames: { name: string }[] = [
            { name: 'download' },
            { name: 'href' },
            { name: 'hreflang' },
            { name: 'ping' },
            { name: 'referrerpolicy' },
            { name: 'rel' },
            { name: 'target' },
            { name: 'type' }
        ];
        describe('should reflect value to the internal control', () => {
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const attribute of attributeNames) {
                const specType = getSpecTypeByNamedList(
                    attribute,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(`for attribute ${attribute.name}`, async () => {
                    await connect();

                    element.setAttribute(attribute.name, 'foo');
                    await waitForUpdatesAsync();

                    expect(element.control.getAttribute(attribute.name)).toBe(
                        'foo'
                    );
                });
            }
        });

        it('should expose slotted content through properties', async () => {
            await connect();
            expect(element.start.assignedElements()[0]).toBe(model.xmarkIcon);
            expect(element.end.assignedElements()[0]).toBe(model.checkIcon);
        });

        it('should set start and end slots visible', async () => {
            await connect();
            expect(
                getComputedStyle(element.start).display === 'none'
                    || getComputedStyle(element.startContainer).display === 'none'
            ).toBeFalse();
            expect(
                getComputedStyle(element.end).display === 'none'
                    || getComputedStyle(element.endContainer).display === 'none'
            ).toBeFalse();
        });
    });

    describe('in tree-view', () => {
        class Model {
            public treeView!: TreeView;
            public root1!: TreeItem; // starts off expanded
            public root2!: TreeItem;
            public leaf1!: AnchorTreeItem; // starts off selected
            public leaf2!: AnchorTreeItem;
            public leaf3!: AnchorTreeItem;
            public subRoot1!: TreeItem;
            public subRoot2!: TreeItem;
        }

        async function setup(source: Model): Promise<Fixture<TreeView>> {
            return fixture<TreeView>(
                // prettier-ignore
                html<Model>`
                <nimble-tree-view ${ref('treeView')}>
                    <nimble-tree-item ${ref('root1')}>Root1
                        <nimble-tree-item ${ref('subRoot1')}>SubRoot
                            <nimble-anchor-tree-item ${ref('leaf1')} href="#" selected>Leaf1</nimble-anchor-tree-item>
                        </nimble-tree-item>
                        <nimble-anchor-tree-item ${ref('leaf2')} href="#">Leaf 2</nimble-anchor-tree-item>
                    </nimble-tree-item>
                    <nimble-tree-item ${ref('root2')}>Root2
                        <nimble-tree-item ${ref('subRoot2')}>SubRoot 2
                            <nimble-anchor-tree-item ${ref('leaf3')} href="#">Leaf 3</nimble-anchor-tree-item>
                        </nimble-tree-item>
                    </nimble-tree-item>
                </nimble-tree-view>`,
                { source }
            );
        }

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

        it('root1 should have "group-selected" attribute set after initialization', () => {
            expect(model.root1.hasAttribute('group-selected')).toBeTrue();
            expect(model.root2.hasAttribute('group-selected')).toBeFalse();
        });

        it('when leaf item is selected, only root parent tree item has "group-selected" attribute', async () => {
            model.leaf3.selected = true;
            await waitForUpdatesAsync(); // reflect selected property to attribute
            await waitForUpdatesAsync(); // FAST updates selectedItems (based on attribute change)
            expect(model.root2.hasAttribute('group-selected')).toBeTrue();
            expect(model.subRoot2.hasAttribute('group-selected')).toBeFalse();
            expect(model.root1.hasAttribute('group-selected')).toBeFalse();
            expect(model.leaf3.hasAttribute('group-selected')).toBeFalse();

            model.leaf1.selected = true;
            await waitForUpdatesAsync(); // reflect selected property to attribute
            await waitForUpdatesAsync(); // FAST updates selectedItems (based on attribute change)
            expect(model.root2.hasAttribute('group-selected')).toBeFalse();
            expect(model.subRoot2.hasAttribute('group-selected')).toBeFalse();
            expect(model.root1.hasAttribute('group-selected')).toBeTrue();
            expect(model.leaf3.hasAttribute('group-selected')).toBeFalse();
        });

        it('when leaf item is deselected, root parent tree loses "group-selected" attribute', async () => {
            model.leaf1.selected = false;
            await waitForUpdatesAsync(); // reflect selected property to attribute
            await waitForUpdatesAsync(); // FAST updates selectedItems (based on attribute change)
            expect(model.root1.hasAttribute('group-selected')).toBeFalse();
        });

        it('when second leaf item under same root parent is selected, root parent tree item has "group-selected" attribute', async () => {
            model.leaf2.selected = true;
            await waitForUpdatesAsync(); // reflect selected property to attribute
            await waitForUpdatesAsync(); // FAST updates selectedItems (based on attribute change)
            expect(model.root1.hasAttribute('group-selected')).toBeTrue();
        });

        it('when selected item is removed, root parent tree loses "group-selected" attribute', async () => {
            expect(model.leaf1.selected).toBeTrue();
            model.leaf1.remove();
            await waitForUpdatesAsync();
            expect(model.root1.hasAttribute('group-selected')).toBeFalse();
        });

        it('when non-selected item is removed, root parent tree keeps "group-selected" attribute', async () => {
            model.leaf2.remove();
            await waitForUpdatesAsync();
            expect(model.root1.hasAttribute('group-selected')).toBeTrue();
        });

        it('when selected item is added to tree, root parent tree gains "group-selected" attribute', async () => {
            expect(model.leaf1.selected).toBeTrue();
            model.leaf1.remove();
            await waitForUpdatesAsync();
            model.subRoot1.appendChild(model.leaf1);
            await waitForUpdatesAsync();
            expect(model.root1.hasAttribute('group-selected')).toBeTrue();
        });
    });
});
