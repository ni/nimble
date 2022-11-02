import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

/**
 * Base Table Column Provider
 */
export class BaseColumn extends FoundationElement {
    @attr
    public columnId?: string;

    @attr
    public columnTitle?: string;
}