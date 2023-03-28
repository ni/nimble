/* eslint-disable max-classes-per-file */
import { customElement, html, ref } from '@microsoft/fast-element';
import { TreeItem as FoundationTreeItem } from '@microsoft/fast-foundation';
import { AnchorTreeItem } from '..';
import type { IconCheck } from '../../icons/check';
import type { IconXmark } from '../../icons/xmark';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
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
});
