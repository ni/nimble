// Based on tests in FAST repo: https://github.com/microsoft/fast/blob/1f9c97df9acae24be44f239bd66b5b2157c7f3e5/packages/web-components/fast-foundation/src/breadcrumb-item/breadcrumb-item.spec.ts
import { BreadcrumbItem } from '..';
import { template } from '../template';
import { fixture } from '../../utilities/tests/fixture';

const breadcrumbItem = BreadcrumbItem.compose({
    baseName: 'breadcrumb-item',
    template
});

async function setup(): Promise<{
    element: BreadcrumbItem,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>
}> {
    const { element, connect, disconnect } = await fixture(breadcrumbItem());

    return { element, connect, disconnect };
}

describe('Breadcrumb item', () => {
    it('should include a `role` of `listitem`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element?.shadowRoot?.querySelector("[role='listitem']")
        ).not.toEqual(null);

        await disconnect();
    });

    it('should render `anchor` when `href` is provided', async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(element.shadowRoot?.querySelector('a')).not.toEqual(null);

        await disconnect();
    });

    it('should NOT render `anchor` when `href` is not provided', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.shadowRoot?.querySelector('a')).toEqual(null);

        await disconnect();
    });

    it('should add an element with a class of `separator` when `separator` is true', async () => {
        const { element, connect, disconnect } = await setup();

        element.separator = true;

        await connect();

        expect(element.shadowRoot?.querySelector('.separator')).toBeDefined();

        await disconnect();
    });

    it('should set the `href` attribute on the internal anchor equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;

        await connect();

        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('href')
        ).toEqual(hrefExample);

        await disconnect();
    });

    it('should set the `target` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const hrefExample = 'https://fast.design';
        const targetExample = '_blank';

        element.href = hrefExample;
        element.target = targetExample;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('target')
        ).toEqual(targetExample);

        await disconnect();
    });

    it('should set the `download` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const download = 'foo';
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;
        element.download = download;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('download')
        ).toEqual(download);

        await disconnect();
    });

    it('should set the `hreflang` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const hreflang = 'en-GB';
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;
        element.hreflang = hreflang;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('hreflang')
        ).toEqual(hreflang);

        await disconnect();
    });

    it('should set the `ping` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const ping = 'https://fast.design/trackingthepings';
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;
        element.ping = ping;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('ping')
        ).toEqual(ping);

        await disconnect();
    });

    it('should set the `referrerpolicy` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const referrerpolicy = 'no-referrer';
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;
        element.referrerpolicy = referrerpolicy;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot
                ?.querySelector('a')
                ?.getAttribute('referrerpolicy')
        ).toEqual(referrerpolicy);

        await disconnect();
    });

    it('should set the `rel` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const rel = 'external';
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;
        element.rel = rel;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('rel')
        ).toEqual(rel);

        await disconnect();
    });

    it('should set the `type` attribute on the internal anchor when `href` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        const type = 'text/html';
        const hrefExample = 'https://fast.design';

        element.href = hrefExample;
        element.type = type;

        await connect();

        expect(element.href).toEqual(hrefExample);
        expect(
            element.shadowRoot?.querySelector('a')?.getAttribute('type')
        ).toEqual(type);

        await disconnect();
    });

    describe('Delegates ARIA link', () => {
        it('should set the `aria-atomic` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = 'true';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaAtomic = ariaAtomic;

            expect(element.href).toEqual(hrefExample);
            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-atomic')
            ).toEqual(ariaAtomic);

            await disconnect();
        });

        it('should set the `aria-busy` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = 'false';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaBusy = ariaBusy;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-busy')
            ).toEqual(ariaBusy);

            await disconnect();
        });

        it('should set the `aria-controls` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = 'testId';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaControls = ariaControls;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-controls')
            ).toEqual(ariaControls);

            await disconnect();
        });

        it('should set the `aria-current` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = 'page';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-current')
            ).toEqual(ariaCurrent);

            await disconnect();
        });

        it('should set the `aria-describedby` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = 'testId';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-describedby')
            ).toEqual(ariaDescribedby);

            await disconnect();
        });

        it('should set the `aria-details` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = 'testId';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaDetails = ariaDetails;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-details')
            ).toEqual(ariaDetails);

            await disconnect();
        });

        it('should set the `aria-disabled` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = 'true';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-disabled')
            ).toEqual(ariaDisabled);

            await disconnect();
        });

        it('should set the `aria-errormessage` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = 'test';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-errormessage')
            ).toEqual(ariaErrormessage);

            await disconnect();
        });

        it('should set the `aria-expanded` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaExpanded = 'true';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaExpanded = ariaExpanded;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-expanded')
            ).toEqual(ariaExpanded);

            await disconnect();
        });

        it('should set the `aria-flowto` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = 'testId';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-flowto')
            ).toEqual(ariaFlowto);

            await disconnect();
        });

        it('should set the `aria-haspopup` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = 'true';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-haspopup')
            ).toEqual(ariaHaspopup);

            await disconnect();
        });

        it('should set the `aria-hidden` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = 'true';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaHidden = ariaHidden;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-hidden')
            ).toEqual(ariaHidden);

            await disconnect();
        });

        it('should set the `aria-invalid` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = 'spelling';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-invalid')
            ).toEqual(ariaInvalid);

            await disconnect();
        });

        it('should set the `aria-keyshortcuts` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = 'F4';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-keyshortcuts')
            ).toEqual(ariaKeyshortcuts);

            await disconnect();
        });

        it('should set the `aria-label` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = 'Foo label';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaLabel = ariaLabel;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-label')
            ).toEqual(ariaLabel);

            await disconnect();
        });

        it('should set the `aria-labelledby` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = 'testId';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-labelledby')
            ).toEqual(ariaLabelledby);

            await disconnect();
        });

        it('should set the `aria-live` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = 'polite';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaLive = ariaLive;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-live')
            ).toEqual(ariaLive);

            await disconnect();
        });

        it('should set the `aria-owns` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = 'testId';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaOwns = ariaOwns;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-owns')
            ).toEqual(ariaOwns);

            await disconnect();
        });

        it('should set the `aria-relevant` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = 'removals';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-relevant')
            ).toEqual(ariaRelevant);

            await disconnect();
        });

        it('should set the `aria-roledescription` attribute on the internal anchor when `href` is passed', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = 'slide';
            const hrefExample = 'https://fast.design';

            element.href = hrefExample;
            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(element.href).toEqual(hrefExample);
            expect(
                element.shadowRoot
                    ?.querySelector('a')
                    ?.getAttribute('aria-roledescription')
            ).toEqual(ariaRoledescription);

            await disconnect();
        });
    });
});
