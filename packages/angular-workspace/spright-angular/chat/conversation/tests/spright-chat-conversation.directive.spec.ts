import { TestBed } from '@angular/core/testing';
import { SprightChatConversationModule } from '../spright-chat-conversation.module';

describe('Spright chat', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatConversationModule]
            });
        });

        it('conversation custom element is defined', () => {
            expect(customElements.get('spright-chat-conversation')).not.toBeUndefined();
        });
    });
});
