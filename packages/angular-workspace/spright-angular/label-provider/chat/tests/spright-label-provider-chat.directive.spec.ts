import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type LabelProviderChat, SprightLabelProviderChatDirective } from '../spright-label-provider-chat.directive';
import { SprightLabelProviderChatModule } from '../spright-label-provider-chat.module';

describe('Spright chat label provider', () => {
    @Component({
        template: `
            <spright-label-provider-chat #labelProvider
                [send]="send"
                [stop]="stop">
            </spright-label-provider-chat>
        `,
        standalone: false
    })
    class TestHostComponent {
        @ViewChild('labelProvider', { read: SprightLabelProviderChatDirective }) public directive: SprightLabelProviderChatDirective;
        @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderChat>;
        public send = 'Send message';
        public stop = 'Stop response';
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let directive: SprightLabelProviderChatDirective;
    let nativeElement: LabelProviderChat;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [SprightLabelProviderChatModule],
            providers: [provideZoneChangeDetection()]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        directive = fixture.componentInstance.directive;
        nativeElement = fixture.componentInstance.elementRef.nativeElement;
    });

    it('defines the custom element', () => {
        expect(customElements.get('spright-label-provider-chat')).not.toBeUndefined();
    });

    it('binds labels to the custom element', () => {
        expect(directive.send).toBe('Send message');
        expect(nativeElement.send).toBe('Send message');
        expect(directive.stop).toBe('Stop response');
        expect(nativeElement.stop).toBe('Stop response');
    });
});