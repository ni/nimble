import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbItem, BreadcrumbItemAppearance, NimbleBreadcrumbItemDirective } from '../nimble-breadcrumb-item.directive';
import { NimbleBreadcrumbItemModule } from '../nimble-breadcrumb-item.module';

describe('Nimble breadcrumb item', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleBreadcrumbItemModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-breadcrumb-item')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem></nimble-breadcrumb-item>
            `
        })
        class TestHostComponent {
            @ViewChild('breadcrumbItem', { read: NimbleBreadcrumbItemDirective }) public directive: NimbleBreadcrumbItemDirective;
            @ViewChild('breadcrumbItem', { read: ElementRef }) public elementRef: ElementRef<BreadcrumbItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbItemDirective;
        let nativeElement: BreadcrumbItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbItemAppearance.Hypertext);
            expect(nativeElement.appearance).toBe(BreadcrumbItemAppearance.Hypertext);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem
                    appearance="${BreadcrumbItemAppearance.HoverFill}">
                </nimble-breadcrumb-item>`
        })
        class TestHostComponent {
            @ViewChild('breadcrumbItem', { read: NimbleBreadcrumbItemDirective }) public directive: NimbleBreadcrumbItemDirective;
            @ViewChild('breadcrumbItem', { read: ElementRef }) public elementRef: ElementRef<BreadcrumbItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbItemDirective;
        let nativeElement: BreadcrumbItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbItemAppearance.HoverFill);
            expect(nativeElement.appearance).toBe(BreadcrumbItemAppearance.HoverFill);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem
                    [appearance]="appearance">
                </nimble-breadcrumb-item>
            `
        })
        class TestHostComponent {
            @ViewChild('breadcrumbItem', { read: NimbleBreadcrumbItemDirective }) public directive: NimbleBreadcrumbItemDirective;
            @ViewChild('breadcrumbItem', { read: ElementRef }) public elementRef: ElementRef<BreadcrumbItem>;
            public appearance = BreadcrumbItemAppearance.HoverFill;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbItemDirective;
        let nativeElement: BreadcrumbItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbItemAppearance.HoverFill);
            expect(nativeElement.appearance).toBe(BreadcrumbItemAppearance.HoverFill);

            fixture.componentInstance.appearance = BreadcrumbItemAppearance.Hypertext;
            fixture.detectChanges();

            expect(directive.appearance).toBe(BreadcrumbItemAppearance.Hypertext);
            expect(nativeElement.appearance).toBe(BreadcrumbItemAppearance.Hypertext);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem
                    [attr.appearance]="appearance">
                </nimble-breadcrumb-item>
            `
        })
        class TestHostComponent {
            @ViewChild('breadcrumbItem', { read: NimbleBreadcrumbItemDirective }) public directive: NimbleBreadcrumbItemDirective;
            @ViewChild('breadcrumbItem', { read: ElementRef }) public elementRef: ElementRef<BreadcrumbItem>;
            public appearance = BreadcrumbItemAppearance.HoverFill;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbItemDirective;
        let nativeElement: BreadcrumbItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbItemAppearance.HoverFill);
            expect(nativeElement.appearance).toBe(BreadcrumbItemAppearance.HoverFill);

            fixture.componentInstance.appearance = BreadcrumbItemAppearance.Hypertext;
            fixture.detectChanges();

            expect(directive.appearance).toBe(BreadcrumbItemAppearance.Hypertext);
            expect(nativeElement.appearance).toBe(BreadcrumbItemAppearance.Hypertext);
        });
    });
});
