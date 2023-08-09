import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import type { ViewTemplate } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';

export interface ButtonProperties {
    readonly class: string;
    readonly iconLabel: string;
    readonly tiptapNodeOrMarkName: string;
    readonly iconTemplate: ViewTemplate;
}

/**
 * Base class for handling editor button events.
 */
export abstract class EditorButton {
    public class: string;
    public iconLabel: string;
    public tiptapNodeOrMarkName: string;
    public iconTemplate: ViewTemplate;

    public constructor(protected tiptapEditor: Editor) {
        const buttonProperties = this.getProperties();
        this.class = buttonProperties.class;
        this.iconLabel = buttonProperties.iconLabel;
        this.tiptapNodeOrMarkName = buttonProperties.tiptapNodeOrMarkName;
        this.iconTemplate = buttonProperties.iconTemplate;
    }

    public clickHandler(): void {
        this.tiptapEditor.commands.focus();
        this.doAction();
    }

    public keyDownActivateHandler(event: KeyboardEvent): boolean {
        switch (event.key) {
            case keySpace:
            case keyEnter:
                this.tiptapEditor.commands.focus();
                this.doAction();
                return false;
            default:
                return true;
        }
    }

    protected abstract getProperties(): ButtonProperties;
    protected abstract doAction(): void;
}
