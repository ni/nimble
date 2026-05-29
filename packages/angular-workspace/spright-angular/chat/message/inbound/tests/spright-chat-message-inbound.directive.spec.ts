import { TestBed } from '@angular/core/testing';
import { SprightChatMessageInboundModule } from '../spright-chat-message-inbound.module';

describe('Spright chat message inbound', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatMessageInboundModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-message-inbound')).not.toBeUndefined();
        });
    });
});
