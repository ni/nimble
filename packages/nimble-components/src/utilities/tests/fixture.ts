/* eslint-disable */

// Sourced from:
// https://github.com/microsoft/fast/blob/928d73621c62064992189270a920b2c6d6d9e19e/packages/web-components/fast-foundation/src/test-utilities/fixture.ts
// Pending standalone availability in a package:
// https://github.com/microsoft/fast/issues/4930
// With updated imports and the following patches:
// 1. https://github.com/microsoft/fast/issues/4930#issuecomment-885326451
// 2. Style the parent to be at the top-left corner of the page to prevent intermittencies related to controls being pushed out of the viewport by the tet runner page content.
// 3. Remove the option for a custom parent to be specified in the `FixtureOptions` so that the patch mentioned above will never be unintentially bypassed.

import {
    type Constructable,
    defaultExecutionContext,
    ExecutionContext,
    HTMLView,
    ViewTemplate,
} from '@ni/fast-element';
import { Container, DesignSystem, type DesignSystemRegistrationContext, DI } from '@ni/fast-foundation';

import type {
    FoundationElementDefinition,
    FoundationElementRegistry,
} from '@ni/fast-foundation';

/**
 * Options used to customize the creation of the test fixture.
 */
export interface FixtureOptions {
    /**
     * The document to run the fixture in.
     * @defaultValue `globalThis.document`
     */
    document?: Document;

    /**
     * The data source to bind the HTML to.
     * @defaultValue An empty object.
     */
    source?: any;

    /**
     * The execution context to use during binding.
     * @defaultValue {@link @ni/fast-element#defaultExecutionContext}
     */
    context?: ExecutionContext;

    /**
     * A pre-configured design system instance used in setting up the fixture.
     */
    designSystem?: DesignSystem;
}

export interface Fixture<TElement = HTMLElement> {
    /**
     * The document the fixture is running in.
     */
    document: Document;

    /**
     * The template the fixture was created from.
     */
    template: ViewTemplate;

    /**
     * The view that was created from the fixture's template.
     */
    view: HTMLView;

    /**
     * The parent element that the view was appended to.
     * @remarks
     * This element will be appended to the DOM only
     * after {@link Fixture.connect} has been called.
     */
    parent: HTMLElement;

    /**
     * The first element in the {@link Fixture.view}.
     */
    element: TElement;

    /**
     * Adds the {@link Fixture.parent} to the DOM, causing the
     * connect lifecycle to begin.
     * @remarks
     * Yields control to the caller one Microtask later, in order to
     * ensure that the DOM has settled.
     */
    connect: () => Promise<void>;

    /**
     * Removes the {@link Fixture.parent} from the DOM, causing the
     * disconnect lifecycle to begin.
     * @remarks
     * Yields control to the caller one Microtask later, in order to
     * ensure that the DOM has settled.
     */
    disconnect: () => Promise<void>;
}

function findElement(view: HTMLView): HTMLElement {
    let current: Node | null = view.firstChild;

    while (current !== null && current.nodeType !== 1) {
        current = current.nextSibling;
    }

    return current as any;
}

/**
 * Creates a random, unique name suitable for use as a Custom Element name.
 */
export function uniqueElementName(): string {
    return `fast-unique-${Math.random().toString(36).substring(7)}`;
}

function isElementRegistry<T>(
    obj: any
): obj is FoundationElementRegistry<FoundationElementDefinition, any> {
    return typeof obj.register === "function";
}

/**
 * Creates a test fixture suitable for testing custom elements, templates, and bindings.
 * @param templateNameOrRegistry An HTML template or single element name to create the fixture for.
 * @param options Enables customizing fixture creation behavior.
 * @remarks
 * Yields control to the caller one Microtask later, in order to
 * ensure that the DOM has settled.
 */
export async function fixture<TElement = HTMLElement>(
    templateNameOrRegistry:
        | ViewTemplate
        | string
        | FoundationElementRegistry<FoundationElementDefinition, Constructable<TElement>>
        | [
              FoundationElementRegistry<
                  FoundationElementDefinition,
                  Constructable<TElement>
              >,
              ...FoundationElementRegistry<FoundationElementDefinition, Constructable>[]
          ],
    options: FixtureOptions = {}
): Promise<Fixture<TElement>> {
    const document = options.document || globalThis.document;
    const parent = Object.assign(document.createElement("div"), {
        // Position the fixture in the top-left corner of the page.
        // Prevents intermittencies related to controls being pushed out of the
        // view port by test runner page content, i.e. jasmine reporter content
        style: 'position: absolute; top: 0; left: 0;'
    });
    const source = options.source || {};
    const context = options.context || defaultExecutionContext;

    if (typeof templateNameOrRegistry === "string") {
        const html = `<${templateNameOrRegistry}></${templateNameOrRegistry}>`;
        templateNameOrRegistry = new ViewTemplate(html, []);
    } else if (isElementRegistry(templateNameOrRegistry)) {
        templateNameOrRegistry = [templateNameOrRegistry];
    }

    if (Array.isArray(templateNameOrRegistry)) {
        const first = templateNameOrRegistry[0];
        const ds = options.designSystem || DesignSystem.getOrCreate(parent);
        let prefix = "";

        ds.register(templateNameOrRegistry, {
            register(container: Container, context: DesignSystemRegistrationContext) {
                prefix = context.elementPrefix;
            },
        });

        const elementName = `${prefix}-${first.definition.baseName}`;
        const html = `<${elementName}></${elementName}>`;
        templateNameOrRegistry = new ViewTemplate(html, []);
    }

    const view = templateNameOrRegistry.create();
    const element = findElement(view) as any;
    let isConnected = false;

    view.bind(source, context);
    view.appendTo(parent);

    customElements.upgrade(parent);

    // Hook into the Microtask Queue to ensure the DOM is settled
    // before yielding control to the caller.
    await Promise.resolve();

    const connect = async () => {
        if (isConnected) {
            return;
        }

        isConnected = true;
        document.body.appendChild(parent);
        await Promise.resolve();
    };

    const disconnect = async () => {
        if (!isConnected) {
            return;
        }

        isConnected = false;
        document.body.removeChild(parent);
        await Promise.resolve();
    };

    return {
        document,
        template: templateNameOrRegistry,
        view,
        parent,
        element,
        connect,
        disconnect,
    };
}
