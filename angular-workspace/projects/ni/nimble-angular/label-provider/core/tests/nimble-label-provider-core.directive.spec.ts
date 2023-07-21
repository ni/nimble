import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelProviderCore, NimbleLabelProviderCoreDirective } from '../nimble-label-provider-core.directive';
import { NimbleLabelProviderCoreModule } from '../nimble-label-provider-core.module';

describe('Nimble Label Provider Core', () => {
    const label1 = 'String 1';
    const label2 = 'String 2';
    const label3 = 'String 3';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleLabelProviderCoreModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-label-provider-core')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider></nimble-label-provider-core>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderCoreDirective }) public directive: NimbleLabelProviderCoreDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderCore>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderCoreDirective;
        let nativeElement: LabelProviderCore;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderCoreModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for popupDismiss', () => {
            expect(directive.popupDismiss).toBeUndefined();
            expect(nativeElement.popupDismiss).toBeUndefined();
        });

        it('has expected defaults for numericDecrement', () => {
            expect(directive.numericDecrement).toBeUndefined();
            expect(nativeElement.numericDecrement).toBeUndefined();
        });

        it('has expected defaults for numericIncrement', () => {
            expect(directive.numericIncrement).toBeUndefined();
            expect(nativeElement.numericIncrement).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider
                    popup-dismiss="${label1}"
                    numeric-decrement="${label2}"
                    numeric-increment="${label3}"
                    >
                </nimble-label-provider-core>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderCoreDirective }) public directive: NimbleLabelProviderCoreDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderCore>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderCoreDirective;
        let nativeElement: LabelProviderCore;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderCoreModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for popupDismiss', () => {
            expect(directive.popupDismiss).toBe(label1);
            expect(nativeElement.popupDismiss).toBe(label1);
        });

        it('will use template string values for numericDecrement', () => {
            expect(directive.numericDecrement).toBe(label2);
            expect(nativeElement.numericDecrement).toBe(label2);
        });

        it('will use template string values for numericIncrement', () => {
            expect(directive.numericIncrement).toBe(label3);
            expect(nativeElement.numericIncrement).toBe(label3);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider
                    [popupDismiss]="popupDismiss"
                    [numericDecrement]="numericDecrement"
                    [numericIncrement]="numericIncrement"
                    >
                </nimble-label-provider-core>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderCoreDirective }) public directive: NimbleLabelProviderCoreDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderCore>;
            public popupDismiss = label1;
            public numericDecrement = label1;
            public numericIncrement = label1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderCoreDirective;
        let nativeElement: LabelProviderCore;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderCoreModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for popupDismiss', () => {
            expect(directive.popupDismiss).toBe(label1);
            expect(nativeElement.popupDismiss).toBe(label1);

            fixture.componentInstance.popupDismiss = label2;
            fixture.detectChanges();

            expect(directive.popupDismiss).toBe(label2);
            expect(nativeElement.popupDismiss).toBe(label2);
        });

        it('can be configured with property binding for numericDecrement', () => {
            expect(directive.numericDecrement).toBe(label1);
            expect(nativeElement.numericDecrement).toBe(label1);

            fixture.componentInstance.numericDecrement = label2;
            fixture.detectChanges();

            expect(directive.numericDecrement).toBe(label2);
            expect(nativeElement.numericDecrement).toBe(label2);
        });

        it('can be configured with property binding for numericIncrement', () => {
            expect(directive.numericIncrement).toBe(label1);
            expect(nativeElement.numericIncrement).toBe(label1);

            fixture.componentInstance.numericIncrement = label2;
            fixture.detectChanges();

            expect(directive.numericIncrement).toBe(label2);
            expect(nativeElement.numericIncrement).toBe(label2);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider
                    [attr.popup-dismiss]="popupDismiss"
                    [attr.numeric-decrement]="numericDecrement"
                    [attr.numeric-increment]="numericIncrement"
                    >
                </nimble-label-provider-core>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderCoreDirective }) public directive: NimbleLabelProviderCoreDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderCore>;
            public popupDismiss = label1;
            public numericDecrement = label1;
            public numericIncrement = label1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderCoreDirective;
        let nativeElement: LabelProviderCore;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderCoreModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for popupDismiss', () => {
            expect(directive.popupDismiss).toBe(label1);
            expect(nativeElement.popupDismiss).toBe(label1);

            fixture.componentInstance.popupDismiss = label2;
            fixture.detectChanges();

            expect(directive.popupDismiss).toBe(label2);
            expect(nativeElement.popupDismiss).toBe(label2);
        });

        it('can be configured with attribute binding for numericDecrement', () => {
            expect(directive.numericDecrement).toBe(label1);
            expect(nativeElement.numericDecrement).toBe(label1);

            fixture.componentInstance.numericDecrement = label2;
            fixture.detectChanges();

            expect(directive.numericDecrement).toBe(label2);
            expect(nativeElement.numericDecrement).toBe(label2);
        });

        it('can be configured with attribute binding for numericIncrement', () => {
            expect(directive.numericIncrement).toBe(label1);
            expect(nativeElement.numericIncrement).toBe(label1);

            fixture.componentInstance.numericIncrement = label2;
            fixture.detectChanges();

            expect(directive.numericIncrement).toBe(label2);
            expect(nativeElement.numericIncrement).toBe(label2);
        });
    });
});
