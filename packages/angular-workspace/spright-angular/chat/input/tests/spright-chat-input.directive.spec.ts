import { TestBed } from '@angular/core/testing';
import { SprightChatInputModule } from '../spright-chat-input.module';

describe('Spright chat', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatInputModule]
            });
        });

        it('input custom element is defined', () => {
            expect(customElements.get('spright-chat-input')).not.toBeUndefined();
        });
    });
});
