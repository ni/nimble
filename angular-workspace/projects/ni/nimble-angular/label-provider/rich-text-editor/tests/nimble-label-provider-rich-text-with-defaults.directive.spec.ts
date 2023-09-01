import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { computeMsgId } from '@angular/compiler';
import { loadTranslations } from '@angular/localize';
import type { LabelProviderRichText } from '../nimble-label-provider-rich-text.directive';
import { NimbleLabelProviderRichTextModule } from '../nimble-label-provider-rich-text.module';

describe('Nimble LabelProviderRichText withDefaults directive', () => {
    @Component({
        template: `
        <nimble-label-provider-rich-text withDefaults #labelProvider>
        </nimble-label-provider-rich-text>
         `
    })
    class TestHostComponent {
        @ViewChild('labelProvider', { static: true }) public labelProvider: ElementRef<LabelProviderRichText>;
    }

    let labelProvider: LabelProviderRichText;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleLabelProviderRichTextModule, CommonModule]
        });
    });

    beforeEach(() => {
        loadTranslations({
            [computeMsgId('Bold', 'Nimble rich text - toggle bold')]: 'Translated Bold',
            [computeMsgId('Italics', 'Nimble rich text - toggle italics')]: 'Translated Italics',
            [computeMsgId('Bulleted List', 'Nimble rich text - toggle bulleted list')]: 'Translated Bulleted List',
            [computeMsgId('Numbered List', 'Nimble rich text - toggle numbered list')]: 'Translated Numbered List',
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        const testHostComponent = fixture.componentInstance;
        labelProvider = testHostComponent.labelProvider.nativeElement;
        fixture.detectChanges();
    });

    it('applies translated values for each label', () => {
        expect(labelProvider.toggleBold).toBe('Translated Bold');
        expect(labelProvider.toggleItalics).toBe('Translated Italics');
        expect(labelProvider.toggleBulletedList).toBe('Translated Bulleted List');
        expect(labelProvider.toggleNumberedList).toBe('Translated Numbered List');
    });
});
