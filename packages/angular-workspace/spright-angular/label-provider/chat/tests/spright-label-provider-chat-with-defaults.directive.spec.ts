import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { computeMsgId } from '@angular/compiler';
import { loadTranslations } from '@angular/localize';
import type { LabelProviderChat } from '../spright-label-provider-chat.directive';
import { SprightLabelProviderChatModule } from '../spright-label-provider-chat.module';

describe('Spright chat label provider withDefaults directive', () => {
    @Component({
        template: `
            <spright-label-provider-chat withDefaults #labelProvider>
            </spright-label-provider-chat>
        `,
        standalone: false
    })
    class TestHostComponent {
        @ViewChild('labelProvider', { static: true }) public labelProvider: ElementRef<LabelProviderChat>;
    }

    let labelProvider: LabelProviderChat;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [SprightLabelProviderChatModule],
            providers: [provideZoneChangeDetection()]
        });
        loadTranslations({
            [computeMsgId('Send', 'Spright chat - send')]: 'Translated Send',
            [computeMsgId('Stop', 'Spright chat - stop')]: 'Translated Stop'
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        labelProvider = fixture.componentInstance.labelProvider.nativeElement;
        fixture.detectChanges();
    });

    it('applies translated values for each label', () => {
        expect(labelProvider.send).toBe('Translated Send');
        expect(labelProvider.stop).toBe('Translated Stop');
    });
});