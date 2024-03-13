import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { computeMsgId } from '@angular/compiler';
import { loadTranslations } from '@angular/localize';
import type { LabelProviderCore } from '../nimble-label-provider-core.directive';
import { NimbleLabelProviderCoreModule } from '../nimble-label-provider-core.module';

describe('Nimble LabelProviderCore withDefaults directive', () => {
    @Component({
        template: `
        <nimble-label-provider-core withDefaults #labelProvider>
        </nimble-label-provider-core>
         `
    })
    class TestHostComponent {
        @ViewChild('labelProvider', { static: true }) public labelProvider: ElementRef<LabelProviderCore>;
    }

    let labelProvider: LabelProviderCore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleLabelProviderCoreModule, CommonModule]
        });
    });

    beforeEach(() => {
        loadTranslations({
            [computeMsgId('Close', 'Nimble popup - dismiss')]: 'Translated close',
            [computeMsgId('Decrement', 'Nimble numeric - decrement')]: 'Translated decrement',
            [computeMsgId('Increment', 'Nimble numeric - increment')]: 'Translated increment',
            [computeMsgId('Error', 'Nimble icon - error')]: 'Translated error',
            [computeMsgId('Warning', 'Nimble icon - warning')]: 'Translated warning',
            [computeMsgId('Information', 'Nimble icon - information')]: 'Translated information',
            [computeMsgId('Search', 'Nimble select - search items')]: 'Translated search',
            [computeMsgId('No items found', 'Nimble select - no items')]: 'Translated no items found'
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        const testHostComponent = fixture.componentInstance;
        labelProvider = testHostComponent.labelProvider.nativeElement;
        fixture.detectChanges();
    });

    it('applies translated values for each label', () => {
        expect(labelProvider.popupDismiss).toBe('Translated close');
        expect(labelProvider.numericDecrement).toBe('Translated decrement');
        expect(labelProvider.numericIncrement).toBe('Translated increment');
        expect(labelProvider.errorIcon).toBe('Translated error');
        expect(labelProvider.warningIcon).toBe('Translated warning');
        expect(labelProvider.informationIcon).toBe('Translated information');
        expect(labelProvider.filterSearch).toBe('Translated search');
        expect(labelProvider.filterNoResults).toBe('Translated no items found');
    });
});
