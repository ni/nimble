import * as nimbleIconsMap from '@ni/nimble-tokens/dist/icons/js';
import type { NimbleIconName } from '@ni/nimble-tokens/dist/icons/js';
import { DesignSystem } from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import * as allIconsNamespace from '../../icons/all-icons';
import { iconMetadata } from './icon-metadata';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { IconAdd, iconAddTag } from '../../icons/add';

describe('Icons', () => {
    describe('should have correct SVG structure', () => {
        const nimbleIcons = Object.values(nimbleIconsMap);
        const getSVGElement = (htmlString: string): SVGElement => {
            const template = document.createElement('template');
            template.innerHTML = htmlString;
            const svg = template.content.querySelector('svg');
            return svg!;
        };
        const getPaths = (svg: SVGElement): SVGPathElement[] => Array.from(svg.querySelectorAll('path'));

        const focused: NimbleIconName[] = [];
        const disabled: NimbleIconName[] = [];
        for (const icon of nimbleIcons) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            specType(`for icon ${icon.name}`, () => {
                const svg = getSVGElement(icon.data);
                const paths = getPaths(svg);
                expect(svg).toBeTruthy();
                expect(svg.getAttribute('viewBox')).toBeTruthy();
                expect(svg.getAttribute('height')).toBeNull();
                expect(svg.getAttribute('width')).toBeNull();
                expect(svg.querySelector('defs')).toBeNull();
                for (const path of paths) {
                    expect(path.getAttribute('style')).toBeNull();
                }
            });
        }
    });

    describe('can be constructed', () => {
        type IconName = keyof typeof allIconsNamespace;
        const allIconNames = (Object.keys(allIconsNamespace) as IconName[]).map(
            (x: IconName) => ({ name: x, klass: allIconsNamespace[x] })
        );

        const focused: IconName[] = [];
        const disabled: IconName[] = [];
        for (const icon of allIconNames) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for icon ${icon.name}`, () => {
                const tagName = DesignSystem.tagFor(icon.klass);
                expect(typeof tagName).toBe('string');
                expect(tagName.length).toBeGreaterThan(0);
                expect(document.createElement(tagName)).toBeInstanceOf(
                    icon.klass
                );
            });
        }
    });

    describe('should have valid metadata', () => {
        type IconName = keyof typeof iconMetadata;
        const icons = (Object.keys(iconMetadata) as IconName[]).map(name => ({
            name,
            metadata: iconMetadata[name]
        }));

        const focused: IconName[] = [];
        const disabled: IconName[] = [];
        for (const icon of icons) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            specType(`for icon ${icon.name}`, () => {
                expect(icon.metadata.tags).not.toContain('');
            });
        }
    });

    describe('Representative icon', () => {
        async function setup(): Promise<Fixture<IconAdd>> {
            return fixture<IconAdd>(
                html`<${iconAddTag} alt="initial aria label"></${iconAddTag}>`
            );
        }
        let element: IconAdd;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
        });

        afterEach(async () => {
            await disconnect();
        });

        it('sets initial alt text as aria-label on inner SVG', async () => {
            await connect();
            const svg = element.shadowRoot!.querySelector('svg');
            expect(svg?.getAttribute('aria-label')).toEqual(
                'initial aria label'
            );
        });

        it('clears aria-label from inner SVG when alt is blank', async () => {
            await connect();
            element.setAttribute('alt', '');
            const svg = element.shadowRoot!.querySelector('svg');
            expect(svg?.hasAttribute('aria-label')).toBeFalse();
        });

        it('clears aria-label from inner SVG when alt removed from icon', async () => {
            await connect();
            element.removeAttribute('alt');
            const svg = element.shadowRoot!.querySelector('svg');
            expect(svg?.hasAttribute('aria-label')).toBeFalse();
        });

        it('updates aria-label on inner SVG when alt changed on icon', async () => {
            await connect();
            element.setAttribute('alt', 'new aria label');
            const svg = element.shadowRoot!.querySelector('svg');
            expect(svg?.getAttribute('aria-label')).toEqual('new aria label');
        });

        it('sets SVG role to "graphics-symbol img" when alt is non-empty', async () => {
            await connect();
            const svg = element.shadowRoot!.querySelector('svg');
            expect(svg?.getAttribute('role')).toEqual('graphics-symbol img');
        });

        it('sets SVG role to "presentation" when alt is cleared', async () => {
            await connect();
            element.setAttribute('alt', '');
            const svg = element.shadowRoot!.querySelector('svg');
            expect(svg?.getAttribute('role')).toEqual('presentation');
        });
    });
});
