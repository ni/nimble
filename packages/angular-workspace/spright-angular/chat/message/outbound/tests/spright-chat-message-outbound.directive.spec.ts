import { TestBed } from '@angular/core/testing';
import { SprightChatMessageOutboundModule } from '../spright-chat-message-outbound.module';

describe('Spright chat message outbound', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightChatMessageOutboundModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-chat-message-outbound')).not.toBeUndefined();
        });
    });
});
