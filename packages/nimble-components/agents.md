# Nimble Components – AI Instructions

## Overview

The core Web Components library for the Nimble Design System, built on the **FAST Foundation**.

- **Framework**: FAST Element (Web Components)
- **Styling**: SCSS-like `css` tagged templates with Design Tokens
- **Testing**: Karma/Jasmine (Unit), Playwright (Visual/Interaction)

## Build & Test

Run these commands from the repo root:

- **Build**: `npm run build -w @ni/nimble-components`
- **Test (Watch)**: `npm run tdd:watch -w @ni/nimble-components`
- **Test (All Browsers)**: `npm run test-webkit -w @ni/nimble-components`
- **Lint**: `npm run lint -w @ni/nimble-components`

## Key References

- [`CONTRIBUTING.md`](CONTRIBUTING.md) – component lifecycle, Storybook, accessibility.
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

### `styles.ts`

```typescript
import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { bodyFont } from '../theme-provider/design-tokens';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    ${display('flex')}

    @layer base {
        :host {
            font: ${bodyFont};
        }
    }
`;
```

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

## Common Pitfalls

- ❌ **Hardcoded Colors**: Always use tokens (e.g., `bodyFont`), never hex codes or raw CSS vars.
- ❌ **Class-based State**: Use attributes/behaviors to drive state, not `.is-active` classes.
- ❌ **Missing Exports**: Always export the tag constant and update `src/all-components.ts`.
- ❌ **Flaky Tests**: Use `await connect()` and `await disconnect()` in every test.
