import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { FvStickyHeader } from '../ok-fv-sticky-header.directive';
import { OkFvStickyHeaderDirective } from '../ok-fv-sticky-header.directive';
import { OkFvStickyHeaderModule } from '../ok-fv-sticky-header.module';

describe('Ok fv sticky header', () => {
    describe('module', () => {
        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-sticky-header')).not.toBeUndefined();
        });
    });

    @Component({
        template: `
            <ok-fv-sticky-header #stickyHeader>
                <header slot="header">Primary header</header>
                <div slot="sticky-header">Sticky header</div>
            </ok-fv-sticky-header>
        `,
        standalone: false
    })
    class TestHostComponent {
        @ViewChild('stickyHeader', { read: OkFvStickyHeaderDirective }) public directive: OkFvStickyHeaderDirective;
        @ViewChild('stickyHeader', { read: ElementRef }) public elementRef: ElementRef<FvStickyHeader>;
    }

    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [OkFvStickyHeaderModule],
            providers: [provideZoneChangeDetection()]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('projects the primary and sticky headers', () => {
        const element = fixture.componentInstance.elementRef.nativeElement;

        expect(fixture.componentInstance.directive).toBeDefined();
        expect(element.querySelector('[slot="header"]')?.textContent).toBe('Primary header');
        expect(element.querySelector('[slot="sticky-header"]')?.textContent).toBe('Sticky header');
    });
});
