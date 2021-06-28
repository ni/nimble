import {
    designSystemProvider,
    DesignSystemProviderTemplate as template,
    designSystemProperty,
    DesignSystemProvider
} from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";

const niGreen = "#009b65";
const niGreen30 ="#d9f0e8";
const white = "#ffffff";
const black = "#000000";

const styles = css`
:host {
    display: inline-block;
}`;

@designSystemProvider({
    name: "nimble-design-system-provider",
    template,
    styles
})
export class NimbleDesignSystemProvider extends DesignSystemProvider {

    @designSystemProperty({
        attribute: "fill-color",
        cssCustomProperty: "fill-color",
        default: white
    })
    public backgroundColor: string = white;

    @designSystemProperty({
        attribute: "fill-color-hover",
        cssCustomProperty: "fill-color-hover",
        default: niGreen30
    })
    public hoverColor: string = niGreen30;

    @designSystemProperty({
        attribute: "outline-color-hover",
        cssCustomProperty: "outline-color-hover",
        default: niGreen
    })
    public outlineColorHover: string = niGreen;

    @designSystemProperty({
        attribute: "outline-color",
        cssCustomProperty: "outline-color",
        default: black
    })
    public outlineColor: string = black;

    @designSystemProperty({
        attribute: "control-height",
        cssCustomProperty: "control-height",
        default: "30px"
    })
    public controlHeight: string = "30px";

    @designSystemProperty({
        attribute: "standard-padding",
        cssCustomProperty: "standard-padding",
        default: "8px"
    })
    public standardPadding: string = "8px";

    @designSystemProperty({
        attribute: "font-family",
        cssCustomProperty: "font-family",
        default: "Source Sans Pro"
    })
    public fontFamily: string = "Source Sans Pro";

    @designSystemProperty({
        attribute: "label-font-family",
        cssCustomProperty: "label-font-family",
        default: "Space Mono"
    })
    public labelFontFamily: string = "Space Mono";

    @designSystemProperty({
        attribute: "label-font-size",
        cssCustomProperty: "label-font-size",
        default: "11px"
    })
    public labelFontSize: string = "11px";

    @designSystemProperty({
        attribute: "font-color",
        cssCustomProperty: "font-color",
        default: black
    })
    public fontColor: string = black;
}