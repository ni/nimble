import { TestBed } from '@angular/core/testing';
import { SprightChatMessageSystemModule } from '../spright-chat-message-system.module';

describe('Spright chat message system', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatMessageSystemModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-message-system')).not.toBeUndefined();
        });
    });
});
