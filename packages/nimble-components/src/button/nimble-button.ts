import { css, customElement } from "@microsoft/fast-element";
import { Button, buttonTemplate as template } from "@microsoft/fast-foundation";

const styles = css`
:host {
    display: inline-block;
    outline: 1px solid var(--outline-color);
    background-color: var(--fill-color);
    height: var(--control-height);
    padding-left: var(--standard-padding);
    padding-right: var(--standard-padding);
    font-family: var(--font-family);
    cursor: pointer;
    text-align: center;
}

:host(:hover) {
    outline: 1px solid var(--outline-color-hover);
    box-shadow:0px 0px 0px 1px var(--outline-color-hover) inset;
    background-color: var(--fill-color-hover);
}

:host(:active) {
    box-shadow: none;
}

.control {
    background-color: transparent;
    height: inherit;
    border: calc(var(--outline-width) * 1px) solid transparent;
    color: inherit;
    border-radius: inherit;
    fill: inherit;
    cursor: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}`;

@customElement({
    name: "nimble-button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class NimbleButton extends Button {

}