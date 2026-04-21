import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvAccordionItem, FvAccordionItemAppearance, OkFvAccordionItemDirective } from '../ok-fv-accordion-item.directive';
import { OkFvAccordionItemModule } from '../ok-fv-accordion-item.module';

describe('Ok fv accordion item', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvAccordionItemModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-accordion-item')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-accordion-item #accordionItem></ok-fv-accordion-item>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('accordionItem', { read: OkFvAccordionItemDirective }) public directive: OkFvAccordionItemDirective;
            @ViewChild('accordionItem', { read: ElementRef }) public elementRef: ElementRef<FvAccordionItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvAccordionItemDirective;
        let nativeElement: FvAccordionItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvAccordionItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for header', () => {
            expect(directive.header).toBe('');
            expect(nativeElement.header).toBe('');
        });

        it('has expected defaults for expanded', () => {
            expect(directive.expanded).toBeFalse();
            expect(nativeElement.expanded).toBeFalse();
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(FvAccordionItemAppearance.ghost);
            expect(nativeElement.appearance).toBe(FvAccordionItemAppearance.ghost);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-accordion-item #accordionItem
                    header="Test Header"
                    expanded
                    appearance="block">
                </ok-fv-accordion-item>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('accordionItem', { read: OkFvAccordionItemDirective }) public directive: OkFvAccordionItemDirective;
            @ViewChild('accordionItem', { read: ElementRef }) public elementRef: ElementRef<FvAccordionItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvAccordionItemDirective;
        let nativeElement: FvAccordionItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvAccordionItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for header', () => {
            expect(directive.header).toBe('Test Header');
            expect(nativeElement.header).toBe('Test Header');
        });

        it('will use template string values for expanded', () => {
            expect(directive.expanded).toBeTrue();
            expect(nativeElement.expanded).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(FvAccordionItemAppearance.block);
            expect(nativeElement.appearance).toBe(FvAccordionItemAppearance.block);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-accordion-item #accordionItem
                    [header]="header"
                    [expanded]="expanded"
                    [appearance]="appearance">
                </ok-fv-accordion-item>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('accordionItem', { read: OkFvAccordionItemDirective }) public directive: OkFvAccordionItemDirective;
            @ViewChild('accordionItem', { read: ElementRef }) public elementRef: ElementRef<FvAccordionItem>;
            public header = 'Initial Header';
            public expanded = false;
            public appearance: FvAccordionItemAppearance = FvAccordionItemAppearance.ghost;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvAccordionItemDirective;
        let nativeElement: FvAccordionItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvAccordionItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for header', () => {
            expect(directive.header).toBe('Initial Header');
            expect(nativeElement.header).toBe('Initial Header');

            fixture.componentInstance.header = 'Updated Header';
            fixture.detectChanges();

            expect(directive.header).toBe('Updated Header');
            expect(nativeElement.header).toBe('Updated Header');
        });

        it('can be configured with property binding for expanded', () => {
            expect(directive.expanded).toBeFalse();
            expect(nativeElement.expanded).toBeFalse();

            fixture.componentInstance.expanded = true;
            fixture.detectChanges();

            expect(directive.expanded).toBeTrue();
            expect(nativeElement.expanded).toBeTrue();
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(FvAccordionItemAppearance.ghost);
            expect(nativeElement.appearance).toBe(FvAccordionItemAppearance.ghost);

            fixture.componentInstance.appearance = FvAccordionItemAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(FvAccordionItemAppearance.outline);
            expect(nativeElement.appearance).toBe(FvAccordionItemAppearance.outline);
        });
    });
});
