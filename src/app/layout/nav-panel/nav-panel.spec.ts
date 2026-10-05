import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPanel } from './nav-panel';

describe('NavPanel', () => {
  let component: NavPanel;
  let fixture: ComponentFixture<NavPanel>;

  afterEach(() => vi.restoreAllMocks());

  beforeEach(async () => {
    vi.spyOn(MatIconRegistry.prototype, 'getNamedSvgIcon').mockImplementation(() =>
      of(document.createElementNS('http://www.w3.org/2000/svg', 'svg')),
    );
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()],
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
