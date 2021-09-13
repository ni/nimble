import { DOM, ViewTemplate } from '@microsoft/fast-element';
import { TreeView, DesignSystem } from '@microsoft/fast-foundation';
import { fixture, Fixture } from '../../tests/utilities/fixture';
import { nimbleTreeItem } from '../../tree-item';
import { nimbleTreeView } from '../index';
import { clickElement } from '../../tests/utilities/component-test-helpers';

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());

async function setup(): Promise<Fixture<TreeView>> {
    return fixture<TreeView>(new ViewTemplate(
        `<nimble-tree-view>
            <nimble-tree-item class="root">Root1
                <nimble-tree-item class="sub-root">SubRoot
                    <nimble-tree-item class="leaf1">Leaf 1</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item class="leaf2">Leaf 2</nimble-tree-item>
            </nimble-tree-item>
        </nimble-tree-view>`, []
    ));
}

describe('TreeView', () => {
    it('root should not be selected after bring clicked, but should be expanded', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        const rootItem = element.querySelector<HTMLElement>('.root')!;

        await clickElement(rootItem);

        expect(
            rootItem
                ?.hasAttribute('selected')
        ).toBe(false);

        expect(
            rootItem
                ?.hasAttribute('expanded')
        ).toBe(true);

        await clickElement(rootItem);

        expect(
            rootItem
                ?.hasAttribute('selected')
        ).toBe(false);

        expect(
            rootItem
                ?.hasAttribute('expanded')
        ).toBe(false);

        await disconnect();
    });

    it('leaf should stay selected after parent is expanded\\collapsed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        const rootItem = element.querySelector<HTMLElement>('.root')!;
        const leafItem = element.querySelector<HTMLElement>('.leaf2')!;

        await clickElement(rootItem); // expand root
        await clickElement(leafItem); // select leaf

        expect(
            leafItem
                ?.hasAttribute('selected')
        ).toBe(true);

        await clickElement(rootItem); // collapse root

        expect(
            leafItem
                ?.hasAttribute('selected')
        ).toBe(true);

        await disconnect();
    });

    it('when glyph is clicked tree group is expanded', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await DOM.nextUpdate();

        const rootItem = element.querySelector<HTMLElement>('.root')!;
        const rootExpandButton = rootItem?.shadowRoot?.querySelector<HTMLElement>('.expand-collapse-button');

        await clickElement(rootExpandButton!);

        expect(
            rootItem
                ?.hasAttribute('expanded')
        ).toBe(true);

        await disconnect();
    });
});
