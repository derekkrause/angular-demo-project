import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPanel } from './nav-panel';

describe('NavPanel', () => {
  let component: NavPanel;
  let fixture: ComponentFixture<NavPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(NavPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
