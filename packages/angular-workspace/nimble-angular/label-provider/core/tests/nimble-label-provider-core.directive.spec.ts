import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelProviderCore, NimbleLabelProviderCoreDirective } from '../nimble-label-provider-core.directive';
import { NimbleLabelProviderCoreModule } from '../nimble-label-provider-core.module';

describe('Nimble Label Provider Core', () => {
    const label1 = 'String 1';
    const label2 = 'String 2';
    const label3 = 'String 3';
    const label4 = 'String 4';
    const label5 = 'String 5';
    const label6 = 'String 6';
    const label7 = 'String 7';
    const label8 = 'String 8';

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

        it('has expected defaults for popupIconError', () => {
            expect(directive.popupIconError).toBeUndefined();
            expect(nativeElement.popupIconError).toBeUndefined();
        });

        it('has expected defaults for popupIconWarning', () => {
            expect(directive.popupIconWarning).toBeUndefined();
            expect(nativeElement.popupIconWarning).toBeUndefined();
        });

        it('has expected defaults for popupIconInformation', () => {
            expect(directive.popupIconInformation).toBeUndefined();
            expect(nativeElement.popupIconInformation).toBeUndefined();
        });

        it('has expected defaults for filterSearch', () => {
            expect(directive.filterSearch).toBeUndefined();
            expect(nativeElement.filterSearch).toBeUndefined();
        });

        it('has expected defaults for filterNoResults', () => {
            expect(directive.filterNoResults).toBeUndefined();
            expect(nativeElement.filterNoResults).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider
                    popup-dismiss="${label1}"
                    numeric-decrement="${label2}"
                    numeric-increment="${label3}"
                    popup-icon-error="${label4}"
                    popup-icon-warning="${label5}"
                    popup-icon-information="${label6}"
                    filter-search="${label7}"
                    filter-no-results="${label8}"
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

        it('will use template string values for popupIconError', () => {
            expect(directive.popupIconError).toBe(label4);
            expect(nativeElement.popupIconError).toBe(label4);
        });

        it('will use template string values for popupIconWarning', () => {
            expect(directive.popupIconWarning).toBe(label5);
            expect(nativeElement.popupIconWarning).toBe(label5);
        });

        it('will use template string values for popupIconInformation', () => {
            expect(directive.popupIconInformation).toBe(label6);
            expect(nativeElement.popupIconInformation).toBe(label6);
        });

        it('will use template string values for filterSearch', () => {
            expect(directive.filterSearch).toBe(label7);
            expect(nativeElement.filterSearch).toBe(label7);
        });

        it('will use template string values for filterNoResults', () => {
            expect(directive.filterNoResults).toBe(label8);
            expect(nativeElement.filterNoResults).toBe(label8);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider
                    [popupDismiss]="popupDismiss"
                    [numericDecrement]="numericDecrement"
                    [numericIncrement]="numericIncrement"
                    [popupIconError]="popupIconError"
                    [popupIconWarning]="popupIconWarning"
                    [popupIconInformation]="popupIconInformation"
                    [filterSearch]="filterSearch"
                    [filterNoResults]="filterNoResults"
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
            public popupIconError = label1;
            public popupIconWarning = label1;
            public popupIconInformation = label1;
            public filterSearch = label1;
            public filterNoResults = label1;
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

        it('can be configured with property binding for popupIconError', () => {
            expect(directive.popupIconError).toBe(label1);
            expect(nativeElement.popupIconError).toBe(label1);

            fixture.componentInstance.popupIconError = label2;
            fixture.detectChanges();

            expect(directive.popupIconError).toBe(label2);
            expect(nativeElement.popupIconError).toBe(label2);
        });

        it('can be configured with property binding for popupIconWarning', () => {
            expect(directive.popupIconWarning).toBe(label1);
            expect(nativeElement.popupIconWarning).toBe(label1);

            fixture.componentInstance.popupIconWarning = label2;
            fixture.detectChanges();

            expect(directive.popupIconWarning).toBe(label2);
            expect(nativeElement.popupIconWarning).toBe(label2);
        });

        it('can be configured with property binding for popupIconInformation', () => {
            expect(directive.popupIconInformation).toBe(label1);
            expect(nativeElement.popupIconInformation).toBe(label1);

            fixture.componentInstance.popupIconInformation = label2;
            fixture.detectChanges();

            expect(directive.popupIconInformation).toBe(label2);
            expect(nativeElement.popupIconInformation).toBe(label2);
        });

        it('can be configured with property binding for filterSearch', () => {
            expect(directive.filterSearch).toBe(label1);
            expect(nativeElement.filterSearch).toBe(label1);

            fixture.componentInstance.filterSearch = label2;
            fixture.detectChanges();

            expect(directive.filterSearch).toBe(label2);
            expect(nativeElement.filterSearch).toBe(label2);
        });

        it('can be configured with property binding for filterNoResults', () => {
            expect(directive.filterNoResults).toBe(label1);
            expect(nativeElement.filterNoResults).toBe(label1);

            fixture.componentInstance.filterNoResults = label2;
            fixture.detectChanges();

            expect(directive.filterNoResults).toBe(label2);
            expect(nativeElement.filterNoResults).toBe(label2);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-core #labelProvider
                    [attr.popup-dismiss]="popupDismiss"
                    [attr.numeric-decrement]="numericDecrement"
                    [attr.numeric-increment]="numericIncrement"
                    [attr.popup-icon-error]="popupIconError"
                    [attr.popup-icon-warning]="popupIconWarning"
                    [attr.popup-icon-information]="popupIconInformation"
                    [attr.filter-search]="filterSearch"
                    [attr.filter-no-results]="filterNoResults"
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
            public popupIconError = label1;
            public popupIconWarning = label1;
            public popupIconInformation = label1;
            public filterSearch = label1;
            public filterNoResults = label1;
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

        it('can be configured with attribute binding for popupIconError', () => {
            expect(directive.popupIconError).toBe(label1);
            expect(nativeElement.popupIconError).toBe(label1);

            fixture.componentInstance.popupIconError = label2;
            fixture.detectChanges();

            expect(directive.popupIconError).toBe(label2);
            expect(nativeElement.popupIconError).toBe(label2);
        });

        it('can be configured with attribute binding for popupIconWarning', () => {
            expect(directive.popupIconWarning).toBe(label1);
            expect(nativeElement.popupIconWarning).toBe(label1);

            fixture.componentInstance.popupIconWarning = label2;
            fixture.detectChanges();

            expect(directive.popupIconWarning).toBe(label2);
            expect(nativeElement.popupIconWarning).toBe(label2);
        });

        it('can be configured with attribute binding for popupIconInformation', () => {
            expect(directive.popupIconInformation).toBe(label1);
            expect(nativeElement.popupIconInformation).toBe(label1);

            fixture.componentInstance.popupIconInformation = label2;
            fixture.detectChanges();

            expect(directive.popupIconInformation).toBe(label2);
            expect(nativeElement.popupIconInformation).toBe(label2);
        });

        it('can be configured with attribute binding for filterSearch', () => {
            expect(directive.filterSearch).toBe(label1);
            expect(nativeElement.filterSearch).toBe(label1);

            fixture.componentInstance.filterSearch = label2;
            fixture.detectChanges();

            expect(directive.filterSearch).toBe(label2);
            expect(nativeElement.filterSearch).toBe(label2);
        });

        it('can be configured with attribute binding for filterNoResults', () => {
            expect(directive.filterNoResults).toBe(label1);
            expect(nativeElement.filterNoResults).toBe(label1);

            fixture.componentInstance.filterNoResults = label2;
            fixture.detectChanges();

            expect(directive.filterNoResults).toBe(label2);
            expect(nativeElement.filterNoResults).toBe(label2);
        });
    });
});
