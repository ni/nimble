import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import type { ViewTemplate } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';

export interface ButtonInitializers {
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
        const initializers = this.getInitializers();
        this.class = initializers.class;
        this.iconLabel = initializers.iconLabel;
        this.tiptapNodeOrMarkName = initializers.tiptapNodeOrMarkName;
        this.iconTemplate = initializers.iconTemplate;
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

    protected abstract getInitializers(): ButtonInitializers;
    protected abstract doAction(): void;
}
