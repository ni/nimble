# Nimble Components – AI Instructions

## Key References
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (repo) – build/test/change workflows.
- [`packages/nimble-components/CONTRIBUTING.md`](CONTRIBUTING.md) – component lifecycle, Storybook, accessibility.
- [`docs/css-guidelines.md`](docs/css-guidelines.md) – cascade layers, `display()` utility, attribute-driven states.
- [`docs/coding-conventions.md`](docs/coding-conventions.md) – const-object enums, comment expectations.

## Component Skeleton

### `index.ts`
```typescript
import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-example': Example;
    }
}

export class Example extends FoundationElement {
    @attr({ attribute: 'my-attribute' })
    public myAttribute?: string;
}

const nimbleExample = Example.compose({
    baseName: 'example',
    baseClass: FoundationElement,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleExample());
export const exampleTag = 'nimble-example';
```
- Always export the tag constant and update `src/all-components.ts` so bundles include the component.
- Extend the FAST base (`baseClass`) whenever one exists; otherwise extend `FoundationElement`.
- Add `tabIndex` reflection and `shadowOptions.delegatesFocus` when components contain focusable internals.

### `styles.ts`
```typescript
import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { bodyFont } from '../theme-provider/design-tokens';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top

    ${display('flex')}

    @layer base {
        :host {
            font: ${bodyFont};
        }
    }
`;
```
- Use design tokens; never hardcode `var(--ni-nimble-*)` names.
- Organize selectors by document order per `docs/css-guidelines.md`.
- Prefer attribute selectors/behaviors to drive state instead of classes.

### `tests/*.spec.ts`
```typescript
import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Example, exampleTag } from '..';

describe('Example', () => {
    async function setup(): Promise<Fixture<Example>> {
        return fixture<Example>(html`<${exampleTag}></${exampleTag}>`);
    }

    it('constructs a nimble-example', () => {
        expect(document.createElement(exampleTag)).toBeInstanceOf(Example);
    });

    it('updates when attribute changes', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.setAttribute('my-attribute', 'value');

        expect(element.myAttribute).toBe('value');
        await disconnect();
    });
});
```
- Use the fixture helpers for lifecycle management; disconnect in tests to prevent leaks.
- Tag browser-specific skips with `#SkipChrome|Firefox|Webkit` and include an issue link.

## Development Checklist
- Create `index.ts`, `styles.ts`, `template.ts`, `types.ts` (const-object enums only), `tests/`, and `stories/` as required by the package CONTRIBUTING guide.
- Register the component with the proper prefix (`nimble`, `spright`, `ok`) and export the tag constant.
- Add Storybook artifacts: `*.stories.ts`, `*-matrix.stories.ts`, and `*.mdx`.
- Update label-provider metadata and component status stories when APIs change.
- Run `npm run tdd:watch -w @ni/nimble-components`, `npm run storybook`, and `npm run format` before sending revisions.
