import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvMasterDetailListItem, OkFvMasterDetailListItemDirective } from '../ok-fv-master-detail-list-item.directive';
import { OkFvMasterDetailListItemModule } from '../ok-fv-master-detail-list-item.module';

describe('Ok fv master detail list item', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvMasterDetailListItemModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-master-detail-list-item')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-master-detail-list-item #item></ok-fv-master-detail-list-item>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('item', { read: OkFvMasterDetailListItemDirective }) public directive: OkFvMasterDetailListItemDirective;
            @ViewChild('item', { read: ElementRef }) public elementRef: ElementRef<FvMasterDetailListItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvMasterDetailListItemDirective;
        let nativeElement: FvMasterDetailListItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvMasterDetailListItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for titleText', () => {
            expect(directive.titleText).toBe('');
            expect(nativeElement.titleText).toBe('');
        });

        it('has expected defaults for subtitle', () => {
            expect(directive.subtitle).toBe('');
            expect(nativeElement.subtitle).toBe('');
        });

        it('has expected defaults for value', () => {
            expect(directive.value).toBe('');
            expect(nativeElement.value).toBe('');
        });

        it('has expected defaults for compact', () => {
            expect(directive.compact).toBeFalse();
            expect(nativeElement.compact).toBeFalse();
        });

        it('has expected defaults for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();
        });

        it('has expected defaults for statusColor', () => {
            expect(directive.statusColor).toBe('');
            expect(nativeElement.statusColor).toBe('');
        });

        it('has expected defaults for statusLabel', () => {
            expect(directive.statusLabel).toBe('');
            expect(nativeElement.statusLabel).toBe('');
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-master-detail-list-item #item
                    title-text="PXI-1042"
                    subtitle="Calibration due"
                    value="pxi-1042"
                    compact
                    selected
                    status-color="var(--ni-semantic-color-warning)"
                    status-label="Warning">
                </ok-fv-master-detail-list-item>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('item', { read: OkFvMasterDetailListItemDirective }) public directive: OkFvMasterDetailListItemDirective;
            @ViewChild('item', { read: ElementRef }) public elementRef: ElementRef<FvMasterDetailListItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvMasterDetailListItemDirective;
        let nativeElement: FvMasterDetailListItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvMasterDetailListItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for titleText', () => {
            expect(directive.titleText).toBe('PXI-1042');
            expect(nativeElement.titleText).toBe('PXI-1042');
        });

        it('will use template string values for subtitle', () => {
            expect(directive.subtitle).toBe('Calibration due');
            expect(nativeElement.subtitle).toBe('Calibration due');
        });

        it('will use template string values for value', () => {
            expect(directive.value).toBe('pxi-1042');
            expect(nativeElement.value).toBe('pxi-1042');
        });

        it('will use template string values for compact', () => {
            expect(directive.compact).toBeTrue();
            expect(nativeElement.compact).toBeTrue();
        });

        it('will use template string values for selected', () => {
            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('will use template string values for statusColor', () => {
            expect(directive.statusColor).toBe('var(--ni-semantic-color-warning)');
            expect(nativeElement.statusColor).toBe('var(--ni-semantic-color-warning)');
        });

        it('will use template string values for statusLabel', () => {
            expect(directive.statusLabel).toBe('Warning');
            expect(nativeElement.statusLabel).toBe('Warning');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-master-detail-list-item #item
                    [title-text]="titleText"
                    [subtitle]="subtitle"
                    [value]="value"
                    [compact]="compact"
                    [selected]="selected"
                    [status-color]="statusColor"
                    [status-label]="statusLabel">
                </ok-fv-master-detail-list-item>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('item', { read: OkFvMasterDetailListItemDirective }) public directive: OkFvMasterDetailListItemDirective;
            @ViewChild('item', { read: ElementRef }) public elementRef: ElementRef<FvMasterDetailListItem>;
            public titleText = 'PXI-1042';
            public subtitle = 'Calibration due';
            public value = 'pxi-1042';
            public compact = false;
            public selected = false;
            public statusColor = 'var(--ni-semantic-color-warning)';
            public statusLabel = 'Warning';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvMasterDetailListItemDirective;
        let nativeElement: FvMasterDetailListItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvMasterDetailListItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for titleText', () => {
            expect(directive.titleText).toBe('PXI-1042');
            expect(nativeElement.titleText).toBe('PXI-1042');

            fixture.componentInstance.titleText = 'DAQ-1';
            fixture.detectChanges();

            expect(directive.titleText).toBe('DAQ-1');
            expect(nativeElement.titleText).toBe('DAQ-1');
        });

        it('can be configured with property binding for subtitle', () => {
            expect(directive.subtitle).toBe('Calibration due');
            expect(nativeElement.subtitle).toBe('Calibration due');

            fixture.componentInstance.subtitle = 'Ready to run';
            fixture.detectChanges();

            expect(directive.subtitle).toBe('Ready to run');
            expect(nativeElement.subtitle).toBe('Ready to run');
        });

        it('can be configured with property binding for value', () => {
            expect(directive.value).toBe('pxi-1042');
            expect(nativeElement.value).toBe('pxi-1042');

            fixture.componentInstance.value = 'daq-1';
            fixture.detectChanges();

            expect(directive.value).toBe('daq-1');
            expect(nativeElement.value).toBe('daq-1');
        });

        it('can be configured with property binding for compact', () => {
            expect(directive.compact).toBeFalse();
            expect(nativeElement.compact).toBeFalse();

            fixture.componentInstance.compact = true;
            fixture.detectChanges();

            expect(directive.compact).toBeTrue();
            expect(nativeElement.compact).toBeTrue();
        });

        it('can be configured with property binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = true;
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('can be configured with property binding for statusColor', () => {
            expect(directive.statusColor).toBe('var(--ni-semantic-color-warning)');
            expect(nativeElement.statusColor).toBe('var(--ni-semantic-color-warning)');

            fixture.componentInstance.statusColor = 'var(--ni-semantic-color-success)';
            fixture.detectChanges();

            expect(directive.statusColor).toBe('var(--ni-semantic-color-success)');
            expect(nativeElement.statusColor).toBe('var(--ni-semantic-color-success)');
        });

        it('can be configured with property binding for statusLabel', () => {
            expect(directive.statusLabel).toBe('Warning');
            expect(nativeElement.statusLabel).toBe('Warning');

            fixture.componentInstance.statusLabel = 'Ready';
            fixture.detectChanges();

            expect(directive.statusLabel).toBe('Ready');
            expect(nativeElement.statusLabel).toBe('Ready');
        });
    });
});