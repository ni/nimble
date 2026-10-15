import { Component, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OkFvSplitLayoutModule } from '../ok-fv-split-layout.module';
import { OkFvBulkEditFieldModule } from '../../bulk-edit-field/ok-fv-bulk-edit-field.module';
import { OkFvEditCommitBarModule } from '../../edit-commit-bar/ok-fv-edit-commit-bar.module';
import type { CommitMessage } from '../../edit-commit-bar/ok-fv-edit-commit-bar.directive';

@Component({
    template: `
        <ok-fv-split-layout [attr.position]="positionAttribute" min="20" max="80" min-secondary-pixels="320"
            [collapsed]="collapsed" (inputEvent)="events($event)" (changeEvent)="events($event)">
            <section slot="primary"></section>
            <section slot="secondary">
                <ok-fv-bulk-edit-field [label]="label" [attr.status]="statusAttribute" [reset-disabled]="false"
                    clear-disabled (resetEvent)="events($event)" (clearEvent)="events($event)">
                    <input />
                </ok-fv-bulk-edit-field>
                <ok-fv-edit-commit-bar heading="Bulk Edit" [attr.change-count]="changeCountAttribute" affected-row-count="5"
                    hidden-affected-row-count="3" [save-disabled]="false" revert-disabled actions-hidden
                    hide-empty-summary
                    [message]="message" (saveEvent)="events($event)" (revertEvent)="events($event)"
                    (dismissMessage)="events($event)">
                </ok-fv-edit-commit-bar>
            </section>
        </ok-fv-split-layout>
    `,
    standalone: false
})
class TestHostComponent {
    public collapsed = false;
    public positionAttribute = '55';
    public label = 'Location';
    public statusAttribute = 'changed';
    public changeCountAttribute = '2';
    public message: CommitMessage | undefined = { severity: 'error', text: 'Save failed' };
    public events = jasmine.createSpy();
}

@Component({
    template: `
        <ok-fv-split-layout>
            <section slot="primary"></section>
            <section slot="secondary"></section>
        </ok-fv-split-layout>
        <ok-fv-bulk-edit-field>
            <input />
        </ok-fv-bulk-edit-field>
        <ok-fv-edit-commit-bar></ok-fv-edit-commit-bar>
    `,
    standalone: false
})
class DefaultTestHostComponent {}

describe('Ok bulk-edit Angular bindings', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, DefaultTestHostComponent],
            imports: [OkFvSplitLayoutModule, OkFvBulkEditFieldModule, OkFvEditCommitBarModule],
            providers: [provideZoneChangeDetection()]
        });
    });

    it('registers all wrapped custom elements', () => {
        expect(customElements.get('ok-fv-split-layout')).not.toBeUndefined();
        expect(customElements.get('ok-fv-bulk-edit-field')).not.toBeUndefined();
        expect(customElements.get('ok-fv-edit-commit-bar')).not.toBeUndefined();
    });

    it('uses custom element defaults when bindings are omitted', () => {
        const fixture = TestBed.createComponent(DefaultTestHostComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        const layout = root.querySelector('ok-fv-split-layout')!;
        const field = root.querySelector('ok-fv-bulk-edit-field')!;
        const bar = root.querySelector('ok-fv-edit-commit-bar')!;

        expect(layout.min).toBe(35);
        expect(layout.max).toBe(75);
        expect(layout.minSecondaryPixels).toBe(300);
        expect(layout.collapsed).toBeFalse();
        expect(layout.step).toBe(1);
        expect(field.label).toBe('');
        expect(field.status).toBe('unchanged');
        expect(field.resetDisabled).toBeTrue();
        expect(field.clearDisabled).toBeFalse();
        expect(bar.heading).toBe('');
        expect(bar.changeCount).toBe(0);
        expect(bar.affectedRowCount).toBe(0);
        expect(bar.hiddenAffectedRowCount).toBe(0);
        expect(bar.saveDisabled).toBeFalse();
        expect(bar.revertDisabled).toBeFalse();
        expect(bar.actionsHidden).toBeFalse();
        expect(bar.hideEmptySummary).toBeFalse();
        expect(bar.message).toBeUndefined();
    });

    it('converts numeric, boolean, property, and attribute bindings', () => {
        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        const layout = root.querySelector('ok-fv-split-layout')!;
        const field = root.querySelector('ok-fv-bulk-edit-field')!;
        const bar = root.querySelector('ok-fv-edit-commit-bar')!;
        expect(layout.position).toBe(55);
        expect(layout.min).toBe(20);
        expect(layout.max).toBe(80);
        expect(layout.minSecondaryPixels).toBe(320);
        expect(layout.collapsed).toBeFalse();
        expect(field.label).toBe('Location');
        expect(field.status).toBe('changed');
        expect(field.resetDisabled).toBeFalse();
        expect(field.clearDisabled).toBeTrue();
        expect(bar.changeCount).toBe(2);
        expect(bar.affectedRowCount).toBe(5);
        expect(bar.hiddenAffectedRowCount).toBe(3);
        expect(bar.saveDisabled).toBeFalse();
        expect(bar.revertDisabled).toBeTrue();
        expect(bar.actionsHidden).toBeTrue();
        expect(bar.hideEmptySummary).toBeTrue();
        expect(bar.heading).toBe('Bulk Edit');
        expect(bar.message).toBe(fixture.componentInstance.message);

        fixture.componentInstance.collapsed = true;
        fixture.componentInstance.positionAttribute = '65';
        fixture.componentInstance.label = 'Owner';
        fixture.componentInstance.statusAttribute = 'will-clear';
        fixture.componentInstance.changeCountAttribute = '3';
        fixture.componentInstance.message = undefined;
        fixture.detectChanges();
        expect(layout.collapsed).toBeTrue();
        expect(layout.position).toBe(65);
        expect(field.label).toBe('Owner');
        expect(field.status).toBe('will-clear');
        expect(bar.changeCount).toBe(3);
        expect(bar.message).toBeUndefined();
    });

    it('forwards host events without leaking nested control events', () => {
        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;
        for (const [tag, events] of [
            ['ok-fv-split-layout', ['input', 'change']],
            ['ok-fv-bulk-edit-field', ['reset', 'clear']],
            ['ok-fv-edit-commit-bar', ['save', 'revert', 'dismiss-message']]
        ] as const) {
            for (const name of events) {
                const event = new Event(name, { bubbles: true });
                root.querySelector(tag)!.dispatchEvent(event);
                expect(fixture.componentInstance.events).toHaveBeenCalledWith(event);
            }
        }
        fixture.componentInstance.events.calls.reset();
        root.querySelector('input')!.dispatchEvent(new Event('input', { bubbles: true }));
        root.querySelector('input')!.dispatchEvent(new Event('change', { bubbles: true }));
        expect(fixture.componentInstance.events).not.toHaveBeenCalled();
    });
});
