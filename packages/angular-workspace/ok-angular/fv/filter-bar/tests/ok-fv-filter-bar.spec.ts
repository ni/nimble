import { Component, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OkFvFilterBarModule } from '../ok-fv-filter-bar.module';
import type { FvFilterBarQueryDocument } from '../ok-fv-filter-bar.directive';

@Component({
    template: `
        <ok-fv-filter-bar (editFilterEvent)="onQuery($event.detail.query)"
            (clearFilterEvent)="onQuery($event.detail.query)"></ok-fv-filter-bar>
    `,
    imports: [OkFvFilterBarModule]
})
class TestHostComponent {
    public onQuery = jasmine.createSpy<(query: FvFilterBarQueryDocument) => void>();
}

describe('FV filter bar Angular events', () => {
    it('forwards query details for edit and clear', () => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [provideZoneChangeDetection()]
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const bar = (fixture.nativeElement as HTMLElement).querySelector('ok-fv-filter-bar')!;
        const query = { version: 1 as const, root: null };
        for (const name of ['edit-filter', 'clear-filter']) {
            bar.dispatchEvent(new CustomEvent(name, { detail: { query } }));
        }
        expect(fixture.componentInstance.onQuery).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.onQuery).toHaveBeenCalledWith(query);
    });
});
