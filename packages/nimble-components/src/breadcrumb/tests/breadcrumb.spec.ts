import { html } from '@ni/fast-element';
import { Breadcrumb, breadcrumbTag } from '..';
import { breadcrumbItemTag } from '../../breadcrumb-item';
import { BreadcrumbPageObject } from '../testing/breadcrumb.pageobject';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Breadcrumb>> {
    const viewTemplate = html`
        <${breadcrumbTag}>
            <${breadcrumbItemTag}>Item 1</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Item 2</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Item 3</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Item 4</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Item 5</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Item 6</${breadcrumbItemTag}>
        </${breadcrumbTag}>
    `;

    return await fixture<Breadcrumb>(viewTemplate);
}

describe('Breadcrumb', () => {
    let breadcrumbPageObject: BreadcrumbPageObject;
    let element: Breadcrumb;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        breadcrumbPageObject = new BreadcrumbPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(breadcrumbTag)).toBeInstanceOf(
            Breadcrumb
        );
    });

    describe('Scroll buttons', () => {
        it('should not show scroll buttons when the Breadcrumb fit within the container', () => {
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(false);
        });

        it('should show scroll buttons when the Breadcrumb overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(true);
        });

        it('should hide scroll buttons when the Breadcrumb no longer overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300); // first make the Breadcrumb overflow
            await breadcrumbPageObject.setBreadcrumbWidth(1000); // then make the Breadcrumb fit
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(false);
        });

        it('should scroll left when the left scroll button is clicked', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            await breadcrumbPageObject.scrollBreadcrumbItemIntoViewByIndex(5);
            const currentScrollOffset = breadcrumbPageObject.getBreadcrumbViewScrollOffset();
            await breadcrumbPageObject.clickScrollLeftButton();
            expect(
                breadcrumbPageObject.getBreadcrumbViewScrollOffset()
            ).toBeLessThan(currentScrollOffset);
        });

        it('should not scroll left when the left scroll button is clicked and the first breadcrumb item is active', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            await breadcrumbPageObject.clickScrollLeftButton();
            expect(breadcrumbPageObject.getBreadcrumbViewScrollOffset()).toBe(
                0
            );
        });

        it('should scroll right when the right scroll button is clicked', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            await breadcrumbPageObject.clickScrollRightButton();
            expect(
                breadcrumbPageObject.getBreadcrumbViewScrollOffset()
            ).toBeGreaterThan(0);
        });

        it('should not scroll right when the right scroll button is clicked and the last breadcrumb item is active', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            await breadcrumbPageObject.scrollBreadcrumbItemIntoViewByIndex(5);
            const currentScrollOffset = breadcrumbPageObject.getBreadcrumbViewScrollOffset();
            await breadcrumbPageObject.clickScrollRightButton();
            expect(breadcrumbPageObject.getBreadcrumbViewScrollOffset()).toBe(
                currentScrollOffset
            );
        });

        it('should show scroll buttons when new breadcrumb item is added and Breadcrumb overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(450);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(false);
            await breadcrumbPageObject.addBreadcrumbItem(
                'New Item With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(true);
        });

        it('should hide scroll buttons when breadcrumb item is removed and Breadcrumb no longer overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(500);
            await breadcrumbPageObject.addBreadcrumbItem(
                'New Item With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(true);
            await breadcrumbPageObject.removeBreadcrumbItemByIndex(6);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(false);
        });

        it('should show scroll buttons when breadcrumb item label is updated and Breadcrumb overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(450);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(false);
            await breadcrumbPageObject.updateBreadcrumbItemLabel(
                0,
                'New Item With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(true);
        });

        it('should hide scroll buttons when breadcrumb item label is updated and Breadcrumb no longer overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(550);
            await breadcrumbPageObject.addBreadcrumbItem(
                'New Item With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(true);
            await breadcrumbPageObject.updateBreadcrumbItemLabel(6, 'Item 6');
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBe(false);
        });
    });
});
