import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvMasterDetailList, OkFvMasterDetailListDirective } from '../ok-fv-master-detail-list.directive';
import { OkFvMasterDetailListModule } from '../ok-fv-master-detail-list.module';
import { OkFvMasterDetailListItemModule } from '../../master-detail-list-item/ok-fv-master-detail-list-item.module';

describe('Ok fv master detail list', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvMasterDetailListModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-master-detail-list')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-master-detail-list #list>
                    <ok-fv-master-detail-list-item title-text="DAQ-1"></ok-fv-master-detail-list-item>
                </ok-fv-master-detail-list>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('list', { read: OkFvMasterDetailListDirective }) public directive: OkFvMasterDetailListDirective;
            @ViewChild('list', { read: ElementRef }) public elementRef: ElementRef<FvMasterDetailList>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvMasterDetailListDirective;
        let nativeElement: FvMasterDetailList;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvMasterDetailListModule, OkFvMasterDetailListItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBe('Filter items...');
            expect(nativeElement.placeholder).toBe('Filter items...');
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-master-detail-list #list placeholder="Filter devices">
                    <ok-fv-master-detail-list-item title-text="DAQ-1"></ok-fv-master-detail-list-item>
                </ok-fv-master-detail-list>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('list', { read: OkFvMasterDetailListDirective }) public directive: OkFvMasterDetailListDirective;
            @ViewChild('list', { read: ElementRef }) public elementRef: ElementRef<FvMasterDetailList>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvMasterDetailListDirective;
        let nativeElement: FvMasterDetailList;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvMasterDetailListModule, OkFvMasterDetailListItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Filter devices');
            expect(nativeElement.placeholder).toBe('Filter devices');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-master-detail-list #list [placeholder]="placeholder">
                    <ok-fv-master-detail-list-item title-text="DAQ-1"></ok-fv-master-detail-list-item>
                </ok-fv-master-detail-list>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('list', { read: OkFvMasterDetailListDirective }) public directive: OkFvMasterDetailListDirective;
            @ViewChild('list', { read: ElementRef }) public elementRef: ElementRef<FvMasterDetailList>;
            public placeholder = 'Filter devices';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvMasterDetailListDirective;
        let nativeElement: FvMasterDetailList;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvMasterDetailListModule, OkFvMasterDetailListItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('Filter devices');
            expect(nativeElement.placeholder).toBe('Filter devices');

            fixture.componentInstance.placeholder = 'Filter systems';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('Filter systems');
            expect(nativeElement.placeholder).toBe('Filter systems');
        });
    });
});