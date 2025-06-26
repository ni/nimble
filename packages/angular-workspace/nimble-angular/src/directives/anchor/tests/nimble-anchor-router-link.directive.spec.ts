import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleAnchorModule } from '../nimble-anchor.module';

describe('Nimble anchor RouterLinkDirective', () => {
    @Component({
        template: `
            <nimble-anchor routerLink="page1">
                Anchor Text
            </nimble-anchor>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [
                NimbleAnchorModule,
                CommonModule,
            ]
        });
    });

    afterEach(() => {
        processUpdates();
    });

    it('throws an error when used, pointing consumers to nimbleRouterLink', () => {
        expect(() => {
            TestBed.createComponent(TestHostComponent);
        }).toThrowError(/nimbleRouterLink/g);
    });
});
