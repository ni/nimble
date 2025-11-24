# Nimble Components - AI Instructions

## Package Context
- **Package**: `@ni/nimble-components`
- **Framework**: FAST Foundation (Web Components)
- **Styling**: SCSS-like via `css` tagged template literal

## Critical Implementation Patterns

### 1. Component Registration (`index.ts`)
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

/**
 * A nimble-styled example component
 */
export class Example extends FoundationElement {
    @attr
    public myAttribute: string;
}

const nimbleExample = Example.compose({
    baseName: 'example',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleExample());
export const exampleTag = 'nimble-example';
```

### 2. Styling (`styles.ts`)
```typescript
import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { bodyFont } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}  // Always use display() utility for host

    :host {
        font: ${bodyFont};  // Always use design tokens
    }
`;
```

**New components**: Use CSS Cascade Layers with order: `@layer base, hover, focusVisible, active, disabled, top`

**Enums**: Use const objects, not TypeScript enums. See [`docs/coding-conventions.md`](docs/coding-conventions.md#use-const-objects-instead-of-typescript-enums).

**Complete styling rules**: See [`docs/css-guidelines.md`](docs/css-guidelines.md).

### 3. Testing (`tests/*.spec.ts`)
- Use `fixture` helper for creating components.
- Use `setup` helper function for test isolation.
```typescript
import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Example, exampleTag } from '..';

describe('Example', () => {
    async function setup(): Promise<Fixture<Example>> {
        return await fixture<Example>(html`<${exampleTag}></${exampleTag}>`);
    }

    it('can construct an element instance', () => {
        expect(document.createElement(exampleTag)).toBeInstanceOf(Example);
    });

    it('should have default state', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element).toBeDefined();

        await disconnect();
    });
});
```

## Common Tasks
- **Build**: `npm run build`
- **Test**: `npm run tdd:watch -w @ni/nimble-components`
- **Storybook**: `npm run storybook`
