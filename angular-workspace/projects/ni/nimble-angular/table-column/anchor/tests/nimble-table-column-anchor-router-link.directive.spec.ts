import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { processUpdates } from '@ni/nimble-angular';
import { NimbleTableColumnAnchorModule } from '../nimble-table-column-anchor.module';

describe('Nimble anchor table column RouterLinkDirective', () => {
    @Component({
        template: `
            <nimble-table-column-anchor routerLink></nimble-table-column-anchor>
         `
    })
    class TestHostComponent {
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTableColumnAnchorModule,
                CommonModule,
                RouterTestingModule.withRoutes([{ path: '', component: TestHostComponent, pathMatch: 'full' }
                ], { useHash: true })
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
