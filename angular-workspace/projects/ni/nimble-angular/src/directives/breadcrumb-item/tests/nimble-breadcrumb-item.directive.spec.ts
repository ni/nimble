import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbItem, NimbleBreadcrumbItemDirective } from '../nimble-breadcrumb-item.directive';
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

        it('has expected defaults for href', () => {
            expect(directive.href).toBeUndefined();
            expect(nativeElement.href).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem
                    href="#">
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

        it('will use template string values for href', () => {
            expect(directive.href).toBe('#');
            expect(nativeElement.href).toBe('#');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem
                    [href]="href">
                </nimble-breadcrumb-item>
            `
        })
        class TestHostComponent {
            @ViewChild('breadcrumbItem', { read: NimbleBreadcrumbItemDirective }) public directive: NimbleBreadcrumbItemDirective;
            @ViewChild('breadcrumbItem', { read: ElementRef }) public elementRef: ElementRef<BreadcrumbItem>;
            public href = 'http://www.ni.com/';
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

        it('can be configured with property binding for href', () => {
            expect(directive.href).toBe('http://www.ni.com/');
            expect(nativeElement.href).toBe('http://www.ni.com/');

            fixture.componentInstance.href = '#';
            fixture.detectChanges();

            expect(directive.href).toBe('#');
            expect(nativeElement.href).toBe('#');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-breadcrumb-item #breadcrumbItem
                    [attr.href]="href">
                </nimble-breadcrumb-item>
            `
        })
        class TestHostComponent {
            @ViewChild('breadcrumbItem', { read: NimbleBreadcrumbItemDirective }) public directive: NimbleBreadcrumbItemDirective;
            @ViewChild('breadcrumbItem', { read: ElementRef }) public elementRef: ElementRef<BreadcrumbItem>;
            public href = '#';
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

        it('can be configured with attribute binding for href', () => {
            expect(directive.href).toBe('#');
            expect(nativeElement.href).toBe('#');

            fixture.componentInstance.href = 'relative/url';
            fixture.detectChanges();

            expect(directive.href).toBe('relative/url');
            expect(nativeElement.href).toBe('relative/url');
        });
    });
});
