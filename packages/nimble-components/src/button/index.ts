import { css } from "@microsoft/fast-element";
import { Button as FoundationButton, buttonTemplate as template } from "@microsoft/fast-foundation";
import { fillColor, fillColorHover, outlineColor, outlineColorHover, controlHeight, standardPadding, fontFamily } from "../design-system-provider/design-tokens";

const styles = css`
:host {
    display: inline-block;
    outline: 1px solid ${outlineColor};
    background-color: ${fillColor};
    height: ${controlHeight};
    padding-left: ${standardPadding};
    padding-right: ${standardPadding};
    font-family: ${fontFamily};
    cursor: pointer;
    text-align: center;
}

:host(:hover) {
    outline: 1px solid ${outlineColorHover};
    box-shadow:0px 0px 0px 1px ${outlineColorHover} inset;
    background-color: ${fillColorHover};
}

:host(:active) {
    box-shadow: none;
}

.control {
    background-color: transparent;
    height: inherit;
    border: 0px solid transparent;
    color: inherit;
    border-radius: inherit;
    fill: inherit;
    cursor: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}`;

/**
 * A function that returns a nimble-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-button\>
 *
 */
export const nimbleButton = FoundationButton.compose({
    baseName: "button",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});