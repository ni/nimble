/* eslint-disable */

// Source from:
// https://github.com/microsoft/fast/blob/1afe35adf2bf730ac5c09c315b626eec168cd362/packages/web-components/fast-foundation/src/test-utilities/fixture.spec.ts
// With updates to use jasmine

import {
    attr,
    customElement,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { waitForUpdatesAsync } from "../../../testing/async-helpers";
import { uniqueElementName, fixture } from "../fixture";

describe("The fixture helper", () => {
    const name = uniqueElementName();
    const template = html<MyElement>`
        ${x => x.value}
        <slot></slot>
    `;

    @customElement({
        name,
        template,
    })
    class MyElement extends FASTElement {
        @attr value = "value";
    }

    class MyModel {
        @observable value = "different value";
    }

    it("can create a fixture for an element by name", async () => {
        const { element } = await fixture(name);
        expect(element).toBeInstanceOf(MyElement);
    });

    it("can create a fixture for an element by template", async () => {
        const { element } = await fixture(html`
      <${name}>
        Some content here.
      </${name}>
    `);

        expect(element).toBeInstanceOf(MyElement);
        expect(element.innerText.trim()).toEqual("Some content here.");
    });

    it("can connect an element", async () => {
        const { element, connect } = await fixture(name);

        expect(element.isConnected).toEqual(false);

        await connect();

        expect(element.isConnected).toEqual(true);

        document.body.removeChild(element.parentElement!);
    });

    it("can disconnect an element", async () => {
        const { element, connect, disconnect } = await fixture(name);

        expect(element.isConnected).toEqual(false);

        await connect();

        expect(element.isConnected).toEqual(true);

        await disconnect();

        expect(element.isConnected).toEqual(false);
    });

    it("can bind an element to data", async () => {
        const source = new MyModel();
        const { element, disconnect } = await fixture<MyElement>(
            html<MyModel>`
      <${name} value=${x => x.value}></${name}>
    `,
            { source }
        );

        expect(element.value).toEqual(source.value);

        source.value = "something else";

        await waitForUpdatesAsync();

        expect(element.value).toEqual(source.value);

        await disconnect();
    });
});
