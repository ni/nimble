import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvSearchInput, FvSearchInputAppearance, OkFvSearchInputDirective } from '../fv-search-input.directive';
import { OkFvSearchInputModule } from '../fv-search-input.module';

describe('Ok FV search input', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvSearchInputModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-search-input')).not.toBeUndefined();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-search-input #searchInput
                    [appearance]="appearance"
                    [placeholder]="placeholder"
                    [value]="value">
                </ok-fv-search-input>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('searchInput', { read: OkFvSearchInputDirective }) public directive: OkFvSearchInputDirective;
            @ViewChild('searchInput', { read: ElementRef }) public elementRef: ElementRef<FvSearchInput>;
            public appearance: FvSearchInputAppearance = FvSearchInputAppearance.outline;
            public placeholder = 'Search assets';
            public value = 'PXI';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSearchInputDirective;
        let nativeElement: FvSearchInput;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSearchInputModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('Search assets');
            expect(nativeElement.placeholder).toBe('Search assets');

            fixture.componentInstance.placeholder = 'Search systems';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('Search systems');
            expect(nativeElement.placeholder).toBe('Search systems');
        });

        it('can be configured with property binding for value', () => {
            expect(directive.value).toBe('PXI');
            expect(nativeElement.value).toBe('PXI');

            fixture.componentInstance.value = 'DAQ';
            fixture.detectChanges();

            expect(directive.value).toBe('DAQ');
            expect(nativeElement.value).toBe('DAQ');
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(FvSearchInputAppearance.outline);
            expect(nativeElement.appearance).toBe(FvSearchInputAppearance.outline);

            fixture.componentInstance.appearance = FvSearchInputAppearance.superGhost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(FvSearchInputAppearance.superGhost);
            expect(nativeElement.appearance).toBe(FvSearchInputAppearance.superGhost);
        });
    });
});