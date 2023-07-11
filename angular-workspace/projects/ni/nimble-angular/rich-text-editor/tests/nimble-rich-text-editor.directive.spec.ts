import { TestBed } from '@angular/core/testing';
import { NimbleRichTextEditorModule } from '../nimble-rich-text-editor.module';

describe('Nimble Rich Text Editor', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleRichTextEditorModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-rich-text-editor')).not.toBeUndefined();
        });
    });
});
