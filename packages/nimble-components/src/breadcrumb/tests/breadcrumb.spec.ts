import { html } from '@ni/fast-element';
import { Breadcrumb, breadcrumbTag } from '..';
import { breadcrumbItemTag } from '../../breadcrumb-item';
import { BreadcrumbPageObject } from '../testing/breadcrumb.pageobject';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Breadcrumb>> {
    const viewTemplate = html`
        <${breadcrumbTag}>
            <${breadcrumbItemTag} id="1">Tab 1</${breadcrumbItemTag}>
            <${breadcrumbItemTag} id="2">Tab 2</${breadcrumbItemTag}>
            <${breadcrumbItemTag} id="3">Tab 3</${breadcrumbItemTag}>
            <${breadcrumbItemTag} id="4">Tab 4</${breadcrumbItemTag}>
            <${breadcrumbItemTag} id="5">Tab 5</${breadcrumbItemTag}>
            <${breadcrumbItemTag} id="6">Tab 6</${breadcrumbItemTag}>
        </${breadcrumbTag}>
    `;

    return await fixture<Breadcrumb>(viewTemplate);
}

describe('Breadcrumb', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(breadcrumbTag)).toBeInstanceOf(
            Breadcrumb
        );
    });

    describe('Scroll buttons', () => {
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

        it('should not show scroll buttons when the Breadcrumb fit within the container', () => {
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should show scroll buttons when the Breadcrumb overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when the Breadcrumb no longer overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300); // first make the Breadcrumb overflow
            await breadcrumbPageObject.setBreadcrumbWidth(1000); // then make the Breadcrumb fit
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        xit('should scroll left when the left scroll button is clicked', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            // TODO
            // element.activeid = '6'; // scrolls to the last tab
            const currentScrollOffset = breadcrumbPageObject.getBreadcrumbViewScrollOffset();
            await breadcrumbPageObject.clickScrollLeftButton();
            expect(
                breadcrumbPageObject.getBreadcrumbViewScrollOffset()
            ).toBeLessThan(currentScrollOffset);
        });

        it('should not scroll left when the left scroll button is clicked and the first tab is active', async () => {
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

        xit('should not scroll right when the right scroll button is clicked and the last tab is active', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(300);
            // TODO
            // element.activeid = '6'; // scrolls to the last tab
            const currentScrollOffset = breadcrumbPageObject.getBreadcrumbViewScrollOffset();
            await breadcrumbPageObject.clickScrollRightButton();
            expect(breadcrumbPageObject.getBreadcrumbViewScrollOffset()).toBe(
                currentScrollOffset
            );
        });

        it('should show scroll buttons when new tab is added and Breadcrumb overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(450);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeFalse();
            await breadcrumbPageObject.addBreadcrumbItem(
                'New Tab With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when tab is removed and Breadcrumb no longer overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(500);
            await breadcrumbPageObject.addBreadcrumbItem(
                'New Tab With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeTrue();
            await breadcrumbPageObject.removeBreadcrumbItem(6);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should show scroll buttons when tab label is updated and Breadcrumb overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(450);
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeFalse();
            await breadcrumbPageObject.updateBreadcrumbLabel(
                0,
                'New Tab With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when tab label is updated and Breadcrumb no longer overflow the container', async () => {
            await breadcrumbPageObject.setBreadcrumbWidth(550);
            await breadcrumbPageObject.addBreadcrumbItem(
                'New Tab With Extremely Long Name'
            );
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeTrue();
            await breadcrumbPageObject.updateBreadcrumbLabel(6, 'Tab 6');
            expect(breadcrumbPageObject.areScrollButtonsVisible()).toBeFalse();
        });
    });
});
