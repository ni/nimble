import { TestBed } from '@angular/core/testing';
import { NimbleRichTextViewerModule } from '../nimble-rich-text-viewer.module';

describe('Nimble Rich Text Viewer', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleRichTextViewerModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-rich-text-viewer')).not.toBeUndefined();
        });
    });
});