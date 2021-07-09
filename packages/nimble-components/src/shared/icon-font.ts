import { css } from '@microsoft/fast-element';
import styleString from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-font-classes';
import { NimbleIcons as nimbleIconNames } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons';

const nimbleIconFontStyles = css([styleString] as unknown as TemplateStringsArray);
export { nimbleIconFontStyles, nimbleIconNames };
